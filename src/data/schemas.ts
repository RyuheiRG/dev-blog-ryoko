import { z } from "zod";

export const SeoSchema = z.object({
  title: z.string().max(70).nullable(),
  description: z.string().max(160).nullable(),
  og_image: z.string().nullable().optional(),
  canonical_url: z.string().nullable().optional(),
  noindex: z.boolean().optional().default(false),
});

export const MediaSchema = z.object({
  id: z.string(),
  url: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  mime_type: z.string(),
  size_bytes: z.number().int().nonnegative(),
  alt: z.string(),
  blurhash: z.string().nullable().optional(),
  variants: z
    .array(z.object({ width: z.number().int().positive(), url: z.string() }))
    .optional(),
  created_at: z.string(),
});

export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  alias: z.string().nullable().optional(),
  avatar: MediaSchema.nullable().optional(),
  bio: z.string().nullable().optional(),
  github_url: z.string().nullable().optional(),
  linkedin_url: z.string().nullable().optional(),
});

export const TagSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  post_count: z.number().int().nonnegative().optional(),
});

export const PostSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  cover: MediaSchema.nullable(),
  tags: z.array(TagSchema),
  published_at: z.string(),
  updated_at: z.string(),
  reading_time_minutes: z.number().int().positive(),
  featured: z.boolean(),
  publish_status: z.enum(["draft", "published", "archived"]),
  type: z.enum(["article", "note"]),
  seo: SeoSchema,
});

export const PostSchema = PostSummarySchema.extend({
  content_md: z.string(),
  author: AuthorSchema,
});

export const GitHubMetadataSchema = z.object({
  stars: z.number().int().nonnegative(),
  forks: z.number().int().nonnegative(),
  open_issues: z.number().int().nonnegative(),
  language: z.string().nullable(),
  languages: z.array(z.object({ name: z.string(), percent: z.number() })),
  last_commit_at: z.string(),
  license: z.string().nullable(),
  html_url: z.string(),
  homepage: z.string().nullable(),
});

export const ProjectSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  cover: MediaSchema.nullable(),
  stack: z.array(z.string()),
  year: z.number().int(),
  updated_at: z.string(),
  publish_status: z.enum(["draft", "published", "archived"]),
  lifecycle_status: z.enum(["live", "wip", "archived"]),
  featured: z.boolean(),
  repo_url: z.string().nullable(),
  demo_url: z.string().nullable(),
  sort_order: z.number().int(),
  seo: SeoSchema,
});

export const ProjectSchema = ProjectSummarySchema.extend({
  case_study_md: z.string(),
  gallery: z.array(MediaSchema),
  github: GitHubMetadataSchema.nullable(),
  role: z.string().nullable(),
  team: z.array(z.string()),
  learnings: z.array(z.string()),
});

export const SiteSettingsSchema = z.object({
  site_name: z.string(),
  tagline: z.string(),
  description: z.string(),
  url: z.string(),
  locale: z.string(),
  author: AuthorSchema,
  socials: z.array(z.object({ label: z.string(), url: z.string(), icon: z.string() })),
  nav: z.array(z.object({ label: z.string(), href: z.string() })),
  footer: z.object({
    note: z.string(),
    links: z.array(z.object({ label: z.string(), href: z.string() })),
  }),
  seo_defaults: SeoSchema,
  features: z.object({ ads_enabled: z.boolean() }),
});

export const LandingSchema = z.object({
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    alias: z.string(),
    statement: z.string(),
    primary_cta: z.object({ label: z.string(), href: z.string() }),
    secondary_cta: z.object({ label: z.string(), href: z.string() }),
    portrait: MediaSchema.nullable(),
  }),
  about: z.object({
    title: z.string(),
    body_md: z.string(),
    photo: MediaSchema.nullable(),
    highlights: z.array(z.string()),
    facts: z.array(z.object({ label: z.string(), value: z.string() })),
    timeline: z.array(
      z.object({
        year: z.number().int(),
        title: z.string(),
        description: z.string().optional(),
      }),
    ),
  }),
  stack: z.array(
    z.object({
      category: z.string(),
      items: z.array(z.object({ name: z.string(), icon: z.string().nullable() })),
    }),
  ),
  certifications: z.array(
    z.object({
      title: z.string(),
      issuer: z.string(),
      date: z.string(),
      url: z.string().nullable().optional(),
    }),
  ),
  contact: z.object({
    title: z.string(),
    body: z.string(),
    email: z.string(),
    links: z.array(z.object({ label: z.string(), url: z.string(), icon: z.string() })),
  }),
});

export const RedirectSchema = z.object({
  id: z.string(),
  from_path: z.string(),
  to_path: z.string(),
  status: z.union([z.literal(301), z.literal(308)]),
  created_at: z.string(),
});

export type Seo = z.infer<typeof SeoSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type Author = z.infer<typeof AuthorSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type PostSummary = z.infer<typeof PostSummarySchema>;
export type Post = z.infer<typeof PostSchema>;
export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
export type Landing = z.infer<typeof LandingSchema>;
export type Redirect = z.infer<typeof RedirectSchema>;

export type Paginated<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
};
