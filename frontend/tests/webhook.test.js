import { afterEach, describe, expect, it, vi } from "vitest";
import {
  alertDetails,
  handle,
  renderAlertHtml,
  renderAlertText,
} from "../worker/src/index.js";

const SECRET = `whsec_${Buffer.from("a-test-signing-key-for-svix-0001").toString("base64")}`;

const ENV = {
  RESEND_API_KEY: "re_test_key",
  FROM_EMAIL: "notifications@example.com",
  TO_EMAIL: "me@example.com",
  RESEND_WEBHOOK_SECRET: SECRET,
};

const BOUNCE = {
  type: "email.bounced",
  created_at: "2026-11-18T10:52:06.000Z",
  data: {
    email_id: "abc-123",
    from: "Portfolio <notifications@example.com>",
    to: ["me@example.com"],
    subject: "[Portfolio] Test",
    bounce: {
      message: "554 5.7.1 test@example.com is rbl blacklisted",
      type: "Transient",
      subType: "General",
    },
  },
};

// Reproduit la signature Svix de Resend : HMAC-SHA256 de `id.timestamp.corps`.
async function sign(
  body,
  {
    id = "msg_1",
    timestamp = Math.floor(Date.now() / 1000),
    secret = SECRET,
  } = {},
) {
  const key = await crypto.subtle.importKey(
    "raw",
    Buffer.from(secret.replace(/^whsec_/, ""), "base64"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${id}.${timestamp}.${body}`),
  );
  return {
    "svix-id": id,
    "svix-timestamp": String(timestamp),
    "svix-signature": `v1,${Buffer.from(signature).toString("base64")}`,
  };
}

async function webhook(
  event,
  { headers, signOptions, path = "/api/resend-webhook" } = {},
) {
  const body = typeof event === "string" ? event : JSON.stringify(event);
  return new Request(`https://zolenikokolo.com${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? (await sign(body, signOptions))),
    },
    body,
  });
}

function mockResend(ok = true) {
  const fetchMock = vi.fn(
    async () => new Response("{}", { status: ok ? 200 : 500 }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Resend webhook: alerts", () => {
  it("sends an alert e-mail when a contact message bounces", async () => {
    const fetchMock = mockResend();
    const response = await handle(await webhook(BOUNCE), ENV);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_test_key");
    const sent = JSON.parse(init.body);
    expect(sent.from).toBe("Portfolio <notifications@example.com>");
    expect(sent.to).toEqual(["me@example.com"]);
    expect(sent.subject.startsWith("[Alerte] ")).toBe(true);
    expect(sent.text).toContain("rbl blacklisted");
    expect(sent.text).toContain("me@example.com");
    expect(sent.text).toContain("abc-123");
    expect(sent.html).toContain("[WARN]");
    expect(sent.html).toContain("rbl blacklisted");
    expect(sent.html).toContain("https://resend.com/emails/abc-123");
  });

  it.each(["email.complained", "email.delivery_delayed", "email.failed"])(
    "also alerts on %s",
    async (type) => {
      const fetchMock = mockResend();
      const response = await handle(await webhook({ ...BOUNCE, type }), ENV);

      expect(response.status).toBe(200);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    },
  );

  it("ignores events that are not failures", async () => {
    const fetchMock = mockResend();
    const response = await handle(
      await webhook({ ...BOUNCE, type: "email.delivered" }),
      ENV,
    );

    expect(response.status).toBe(200);
    expect((await response.json()).ignored).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("never alerts about its own alert e-mails (no loop)", async () => {
    const fetchMock = mockResend();
    const event = {
      ...BOUNCE,
      data: {
        ...BOUNCE.data,
        subject: "[Alerte] Message du portfolio non remis",
      },
    };
    const response = await handle(await webhook(event), ENV);

    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 502 when the alert cannot be sent, so Resend retries", async () => {
    mockResend(false);
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await handle(await webhook(BOUNCE), ENV);

    expect(response.status).toBe(502);
  });

  it("accepts the path with a trailing slash", async () => {
    mockResend();
    const request = await webhook(BOUNCE, { path: "/api/resend-webhook/" });
    expect((await handle(request, ENV)).status).toBe(200);
  });

  it("truncates a very long bounce reason in the alert", () => {
    const text = renderAlertText(
      {
        ...BOUNCE,
        data: { ...BOUNCE.data, bounce: { message: "x".repeat(2000) } },
      },
      "Rebond",
    );
    expect(text.length).toBeLessThan(900);
  });
});

describe("Resend webhook: alert e-mail layout", () => {
  it("extracts and formats the event details", () => {
    const d = alertDetails(BOUNCE, "Rebond");

    expect(d.level).toBe("WARN");
    expect(d.event).toBe("email.bounced");
    expect(d.to).toBe("me@example.com");
    expect(d.kind).toBe("Transient / General");
    expect(d.date).toBe("2026-11-18 10:52:06 UTC");
    expect(d.id).toBe("abc-123");
  });

  it("copes with a sparse event", () => {
    const d = alertDetails({ type: "email.failed", data: {} }, "Échec");

    expect(d.date).toBe("inconnue");
    expect(d.id).toBe("inconnu");
    expect(d.reason).toBe("non précisé");
    expect(
      renderAlertHtml({ type: "email.failed", data: {} }, "Échec"),
    ).toContain('href="https://resend.com/emails"');
  });

  it("escapes everything that comes from the event", () => {
    const html = renderAlertHtml(
      {
        ...BOUNCE,
        data: {
          ...BOUNCE.data,
          email_id: '"><script>alert(1)</script>',
          subject: "[Portfolio] <img src=x onerror=alert(1)>",
          bounce: { message: "<b>boom</b> & more", type: "Transient" },
        },
      },
      "Rebond <i>",
    );

    expect(html).not.toContain("<script");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<b>boom");
    expect(html).not.toContain("<i>");
    expect(html).toContain("&lt;b&gt;boom&lt;/b&gt; &amp; more");
  });

  it("uses the alert look: orange banner and a dark log block", () => {
    const html = renderAlertHtml(BOUNCE, "Rebond");

    expect(html).toContain("Message du portfolio non remis");
    expect(html).toContain("#c2410c");
    expect(html).toContain("#111827");
    expect(html).toContain("Ouvrir dans Resend");
  });
});

describe("Resend webhook: signature", () => {
  it("rejects a signature made with another secret", async () => {
    const fetchMock = mockResend();
    const other = `whsec_${Buffer.from("another-secret-key-for-svix-0002").toString("base64")}`;
    const response = await handle(
      await webhook(BOUNCE, { signOptions: { secret: other } }),
      ENV,
    );

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a body that was changed after signing", async () => {
    const fetchMock = mockResend();
    const headers = await sign(JSON.stringify(BOUNCE));
    const forged = {
      ...BOUNCE,
      data: { ...BOUNCE.data, subject: "[Portfolio] Forged" },
    };
    const response = await handle(await webhook(forged, { headers }), ENV);

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an old timestamp (replay)", async () => {
    const fetchMock = mockResend();
    const tenMinutesAgo = Math.floor(Date.now() / 1000) - 600;
    const response = await handle(
      await webhook(BOUNCE, { signOptions: { timestamp: tenMinutesAgo } }),
      ENV,
    );

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a request without signature headers", async () => {
    const fetchMock = mockResend();
    const response = await handle(await webhook(BOUNCE, { headers: {} }), ENV);

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts a header that holds several signatures when one is valid", async () => {
    mockResend();
    const headers = await sign(JSON.stringify(BOUNCE));
    headers["svix-signature"] =
      `v1,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA= ${headers["svix-signature"]}`;
    const response = await handle(await webhook(BOUNCE, { headers }), ENV);

    expect(response.status).toBe(200);
  });

  it("returns 500 when the signing secret is not configured", async () => {
    mockResend();
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await handle(await webhook(BOUNCE), {
      ...ENV,
      RESEND_WEBHOOK_SECRET: undefined,
    });

    expect(response.status).toBe(500);
  });

  it("returns 400 on a signed body that is not JSON", async () => {
    mockResend();
    const response = await handle(await webhook("not json"), ENV);

    expect(response.status).toBe(400);
  });

  it("only accepts POST", async () => {
    const request = new Request("https://zolenikokolo.com/api/resend-webhook");
    expect((await handle(request, ENV)).status).toBe(405);
  });
});
