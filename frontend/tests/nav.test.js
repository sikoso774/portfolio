import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Header from "../src/components/Header.astro";
import Footer from "../src/components/Footer.astro";

const EXPECTED_ROUTES = [
  "/about/",
  "/skills/",
  "/experience/",
  "/projects/",
  "/blog/",
  "/contact/",
];

function extractHrefs(html) {
  return [...html.matchAll(/href="([^"]*)"/g)].map((match) => match[1]);
}

describe.each([
  ["Header", Header],
  ["Footer", Footer],
])("%s navigation", (name, Component) => {
  it("never links to a /#id or bare #id anchor", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Component);
    const hrefs = extractHrefs(html);

    const anchorLinks = hrefs.filter((href) => /^\/?#/.test(href));
    expect(anchorLinks, `${name} should not contain anchor links`).toEqual([]);
  });
});

// Le Footer n'a plus de navigation : seul le Header liste toutes les routes.
describe("Header navigation routes", () => {
  it("links to every real route", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Header);
    const hrefs = extractHrefs(html);

    for (const route of EXPECTED_ROUTES) {
      expect(hrefs, `Header should link to ${route}`).toContain(route);
    }
  });
});

describe("Footer links", () => {
  it("keeps the contact CTA", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer);
    expect(extractHrefs(html)).toContain("/contact/");
  });
});
