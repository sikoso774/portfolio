import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  escapeHtml,
  fromHeader,
  handle,
  renderHtml,
  validate,
} from "../worker/src/index.js";

const ENV = {
  RESEND_API_KEY: "re_test_key",
  FROM_EMAIL: "notifications@example.com",
  TO_EMAIL: "me@example.com",
};

const VALID = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Hello",
  message: "Nice portfolio!",
  website: "",
};

function post(
  body,
  { origin = "https://zolenikokolo.com", headers = {} } = {},
) {
  return new Request("https://zolenikokolo.com/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(origin ? { Origin: origin } : {}),
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
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

describe("contact Worker: validation", () => {
  it("accepts a complete message and trims the fields", () => {
    const { data, fields } = validate({ ...VALID, name: "  Ada  " });
    expect(fields).toBeUndefined();
    expect(data.name).toBe("Ada");
  });

  it.each([
    ["name", { name: "" }],
    ["email", { email: "not-an-email" }],
    ["subject", { subject: "   " }],
    ["message", { message: "" }],
    ["subject", { subject: "x".repeat(151) }],
    ["message", { message: "x".repeat(5001) }],
    ["subject", { subject: "Hi\r\nBcc: spam@example.com" }],
    ["name", { name: 42 }],
  ])("rejects an invalid %s", (field, patch) => {
    const { fields } = validate({ ...VALID, ...patch });
    expect(fields).toContain(field);
  });

  it("allows line breaks in the message only", () => {
    expect(validate({ ...VALID, message: "line 1\nline 2" }).data).toBeTruthy();
  });
});

describe("contact Worker: e-mail content", () => {
  it("shows the sender as « Portfolio <address> »", () => {
    expect(fromHeader({ FROM_EMAIL: "notifications@example.com" })).toBe(
      "Portfolio <notifications@example.com>",
    );
  });

  it("keeps only the address when FROM_EMAIL already has a display name", () => {
    expect(
      fromHeader({ FROM_EMAIL: "Someone <notifications@example.com>" }),
    ).toBe("Portfolio <notifications@example.com>");
  });

  it("escapes the visitor's text before putting it in the HTML", () => {
    expect(escapeHtml(`<script>alert("x")</script> & 'y'`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;",
    );

    const html = renderHtml({
      name: "<b>Eve</b>",
      email: "eve@example.com",
      subject: "Hi",
      message: "<img src=x onerror=alert(1)>\nsecond line",
    });
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<b>Eve");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;<br>second line");
  });

  it("offers a reply button that targets the visitor", () => {
    const html = renderHtml({ ...VALID });
    expect(html).toContain(
      'href="mailto:ada@example.com?subject=Re%3A%20Hello"',
    );
    expect(html).toContain("Répondre à Ada Lovelace");
  });
});

describe("contact Worker: request handling", () => {
  it("sends the e-mail through Resend with the secret key", async () => {
    const fetchMock = mockResend();
    const response = await handle(post(VALID), ENV);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_test_key");
    const sent = JSON.parse(init.body);
    expect(sent.from).toBe("Portfolio <notifications@example.com>");
    expect(sent.to).toEqual([ENV.TO_EMAIL]);
    expect(sent.reply_to).toBe(VALID.email);
    expect(sent.subject).toBe("[Portfolio] Hello");
    expect(sent.text).toContain("Nice portfolio!");
    expect(sent.html).toContain("Nice portfolio!");
  });

  it("also accepts the trailing-slash path used by the dev proxy", async () => {
    mockResend();
    const request = new Request("http://localhost:4321/api/contact/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:4321",
      },
      body: JSON.stringify(VALID),
    });

    const response = await handle(request, { ...ENV, ALLOW_LOCALHOST: "true" });
    expect(response.status).toBe(200);
  });

  it("silently drops submissions that fill the honeypot", async () => {
    const fetchMock = mockResend();
    const response = await handle(
      post({ ...VALID, website: "http://spam" }),
      ENV,
    );

    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 400 with the invalid fields and sends nothing", async () => {
    const fetchMock = mockResend();
    const response = await handle(post({ ...VALID, email: "nope" }), ENV);

    expect(response.status).toBe(400);
    expect((await response.json()).fields).toEqual(["email"]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 400 on malformed JSON", async () => {
    mockResend();
    expect((await handle(post("{not json"), ENV)).status).toBe(400);
  });

  it("returns 502 when Resend refuses the e-mail", async () => {
    mockResend(false);
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await handle(post(VALID), ENV)).status).toBe(502);
  });

  it("rejects other origins, missing origins, wrong methods and paths", async () => {
    const fetchMock = mockResend();

    expect(
      (await handle(post(VALID, { origin: "https://evil.example" }), ENV))
        .status,
    ).toBe(403);
    expect((await handle(post(VALID, { origin: null }), ENV)).status).toBe(403);

    const get = new Request("https://zolenikokolo.com/api/contact", {
      headers: { Origin: "https://zolenikokolo.com" },
    });
    expect((await handle(get, ENV)).status).toBe(405);

    const other = new Request("https://zolenikokolo.com/api/other", {
      method: "POST",
    });
    expect((await handle(other, ENV)).status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects non-JSON bodies and oversized payloads", async () => {
    mockResend();
    const form = post("a=b", { headers: { "Content-Type": "text/plain" } });
    expect((await handle(form, ENV)).status).toBe(415);

    const big = post(VALID, { headers: { "Content-Length": "50000" } });
    expect((await handle(big, ENV)).status).toBe(413);
  });

  it("allows localhost only when ALLOW_LOCALHOST is set", async () => {
    mockResend();
    const local = () => post(VALID, { origin: "http://localhost:4321" });

    expect((await handle(local(), ENV)).status).toBe(403);
    expect(
      (await handle(local(), { ...ENV, ALLOW_LOCALHOST: "true" })).status,
    ).toBe(200);
  });

  it("returns 429 when the rate limiter says no", async () => {
    const fetchMock = mockResend();
    const RATE_LIMITER = { limit: vi.fn(async () => ({ success: false })) };
    const response = await handle(
      post(VALID, { headers: { "CF-Connecting-IP": "203.0.113.7" } }),
      { ...ENV, RATE_LIMITER },
    );

    expect(response.status).toBe(429);
    expect(RATE_LIMITER.limit).toHaveBeenCalledWith({ key: "203.0.113.7" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("contact page", () => {
  const source = readFileSync("src/pages/[...locale]/contact.astro", "utf-8");

  it("posts to the Worker route and no longer opens a mailto draft", () => {
    expect(source).toContain("fetch(endpoint");
    expect(source).toContain('"/api/contact"');
    expect(source).not.toContain("window.location.href =");
  });

  it("includes the honeypot field the Worker checks", () => {
    expect(source).toContain('name="website"');
  });
});
