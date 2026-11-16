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

  it("links to every real route", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Component);
    const hrefs = extractHrefs(html);

    for (const route of EXPECTED_ROUTES) {
      expect(hrefs, `${name} should link to ${route}`).toContain(route);
    }
  });
});
