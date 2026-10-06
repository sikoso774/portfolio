import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Hero from "../src/components/Hero.astro";
import About from "../src/components/About.astro";
import SkillsPreview from "../src/components/SkillsPreview.astro";
import ExperiencePreview from "../src/components/ExperiencePreview.astro";
import ProjectsPreview from "../src/components/ProjectsPreview.astro";
import Projects from "../src/components/Projects.astro";
import BlogPreview from "../src/components/BlogPreview.astro";

describe("Hero", () => {
  it("renders the CTA buttons to real routes", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Hero);

    expect(html).toContain('href="/projects/"');
    expect(html).toContain('href="/contact/"');
  });
});

describe("About", () => {
  it("renders the bio card", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About);

    expect(html).toContain("My Journey So Far");
  });

  it("only shows the 'learn more' link when showLink is set", async () => {
    const container = await AstroContainer.create();

    const withoutLink = await container.renderToString(About);
    expect(withoutLink).not.toContain("Learn more about me");

    const withLink = await container.renderToString(About, {
      props: { showLink: true },
    });
    expect(withLink).toContain("Learn more about me");
    expect(withLink).toContain('href="/about/"');
  });
});

describe("SkillsPreview", () => {
  it("shows all 6 skill categories and links to /skills", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SkillsPreview);

    for (const category of [
      "Code",
      "Web",
      "Data Science",
      "Back End / DevOps",
      "OS & Shell",
      "Dev Tools",
    ]) {
      expect(html).toContain(category);
    }
    expect(html).toContain('href="/skills/"');
  });
});

describe("ExperiencePreview", () => {
  it("shows the current role and links to /experience", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ExperiencePreview);

    expect(html).toContain("Python Developer");
    expect(html).toContain("NOXIA Security");
    expect(html).toContain('href="/experience/"');
  });
});

describe("ProjectsPreview", () => {
  it("shows short project cards and links to /projects", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProjectsPreview);

    expect(html).toContain("Nebulux");
    expect(html).toContain('href="/projects/"');
  });
});

describe("Projects", () => {
  it("renders the full projects grid", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Projects);

    for (const title of [
      "Nebulux",
      "Music Player",
      "HYPNOTICA",
      "Scratch Programming Workshop",
      "Data Science Projects",
    ]) {
      expect(html).toContain(title);
    }
  });
});

describe("BlogPreview", () => {
  it("renders without throwing and links to /blog", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(BlogPreview);

    expect(html).toContain('href="/blog/"');
  });
});
