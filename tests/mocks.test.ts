import { describe, expect, it } from "vitest";

import {
  LandingSchema,
  PostSchema,
  ProjectSchema,
  SiteSettingsSchema,
  TagSchema,
} from "@/data/schemas";
import { mockLanding } from "@/data/mock/landing";
import { mockPosts } from "@/data/mock/posts";
import { mockProjects } from "@/data/mock/projects";
import { mockSiteSettings } from "@/data/mock/site";
import { mockTags } from "@/data/mock/tags";

function unique(values: string[]): boolean {
  return new Set(values).size === values.length;
}

describe("mocks del CMS", () => {
  it("la landing cumple LandingSchema", () => {
    expect(LandingSchema.safeParse(mockLanding).success).toBe(true);
  });

  it("los ajustes del sitio cumplen SiteSettingsSchema", () => {
    expect(SiteSettingsSchema.safeParse(mockSiteSettings).success).toBe(true);
  });

  it("las etiquetas cumplen TagSchema y no se repiten", () => {
    for (const tag of mockTags) {
      expect(TagSchema.safeParse(tag).success, tag.slug).toBe(true);
    }
    expect(unique(mockTags.map((tag) => tag.slug))).toBe(true);
    expect(unique(mockTags.map((tag) => tag.id))).toBe(true);
  });

  it("los posts cumplen PostSchema, tienen 2–4 tags y slugs únicos", () => {
    for (const post of mockPosts) {
      expect(PostSchema.safeParse(post).success, post.slug).toBe(true);
      expect(post.tags.length, `${post.slug} necesita entre 2 y 4 tags`).toBeGreaterThanOrEqual(2);
      expect(post.tags.length, `${post.slug} necesita entre 2 y 4 tags`).toBeLessThanOrEqual(4);
      expect(post.content_md.trim().length, `${post.slug} no tiene contenido`).toBeGreaterThan(0);
    }
    expect(unique(mockPosts.map((post) => post.slug))).toBe(true);
    expect(unique(mockPosts.map((post) => post.id))).toBe(true);
  });

  it("los proyectos cumplen ProjectSchema, tienen stack y slugs únicos", () => {
    for (const project of mockProjects) {
      expect(ProjectSchema.safeParse(project).success, project.slug).toBe(true);
      expect(project.stack.length, `${project.slug} no tiene stack`).toBeGreaterThan(0);
      expect(
        project.case_study_md.trim().length,
        `${project.slug} no tiene case study`,
      ).toBeGreaterThan(0);
    }
    expect(unique(mockProjects.map((project) => project.slug))).toBe(true);
    expect(unique(mockProjects.map((project) => project.id))).toBe(true);
  });

  it("cada post referencia tags existentes", () => {
    const available = new Set(mockTags.map((tag) => tag.slug));
    for (const post of mockPosts) {
      for (const tag of post.tags) {
        expect(available.has(tag.slug), `${post.slug} usa el tag ${tag.slug}`).toBe(true);
      }
    }
  });
});
