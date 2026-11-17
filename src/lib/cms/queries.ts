import { z } from "zod";

import {
  LandingSchema,
  PostSchema,
  PostSummarySchema,
  ProjectSchema,
  ProjectSummarySchema,
  RedirectSchema,
  SiteSettingsSchema,
  TagSchema,
  type Landing,
  type Paginated,
  type Post,
  type PostSummary,
  type Project,
  type ProjectSummary,
  type Redirect,
  type SiteSettings,
  type Tag,
} from "@/data/schemas";
import { mockLanding } from "@/data/mock/landing";
import { mockPosts } from "@/data/mock/posts";
import { mockProjects } from "@/data/mock/projects";
import { mockSiteSettings } from "@/data/mock/site";
import { mockTags } from "@/data/mock/tags";
import { CmsError, cmsFetch, isMockMode } from "./client";

const MetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  total_pages: z.number().int().nonnegative(),
  has_next: z.boolean(),
  has_prev: z.boolean(),
});

const PaginatedPostsSchema = z.object({
  data: z.array(PostSummarySchema),
  meta: MetaSchema,
});

const PaginatedProjectsSchema = z.object({
  data: z.array(ProjectSummarySchema),
  meta: MetaSchema,
});

const PostResponseSchema = z.object({ data: PostSchema });
const ProjectResponseSchema = z.object({ data: ProjectSchema });
const RelatedResponseSchema = z.object({ data: z.array(PostSummarySchema) });
const TagResponseSchema = z.object({
  data: z.object({ tag: TagSchema, posts: z.array(PostSummarySchema) }),
});
const TagsResponseSchema = z.object({ data: z.array(TagSchema) });
const RedirectsResponseSchema = z.object({ data: z.array(RedirectSchema) });
const SiteResponseSchema = z.object({ data: SiteSettingsSchema });
const LandingResponseSchema = z.object({ data: LandingSchema });

type PostQuery = {
  page?: number;
  limit?: number;
  tag?: string;
  featured?: boolean;
};

type ProjectQuery = {
  page?: number;
  limit?: number;
  featured?: boolean;
};

function paginate<T>(items: T[], page: number, limit: number): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;

  return {
    data: items.slice(start, start + limit),
    meta: {
      page: safePage,
      limit,
      total,
      total_pages: totalPages,
      has_next: safePage < totalPages,
      has_prev: safePage > 1,
    },
  };
}

function publishedPosts(): PostSummary[] {
  return [...mockPosts]
    .filter((post) => post.publish_status === "published")
    .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
}

function publishedProjects(): ProjectSummary[] {
  return [...mockProjects]
    .filter((project) => project.publish_status === "published")
    .sort((a, b) => a.sort_order - b.sort_order);
}

function countTags(): Tag[] {
  return mockTags
    .map((tag) => ({
      ...tag,
      post_count: mockPosts.filter(
        (post) =>
          post.publish_status === "published" && post.tags.some((item) => item.slug === tag.slug),
      ).length,
    }))
    .filter((tag) => tag.post_count > 0)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isMockMode()) {
    return SiteSettingsSchema.parse(mockSiteSettings);
  }
  const response = await cmsFetch<unknown>({ path: "/v1/public/site" });
  return SiteResponseSchema.parse(response).data;
}

export async function getLanding(): Promise<Landing> {
  if (isMockMode()) {
    return LandingSchema.parse(mockLanding);
  }
  const response = await cmsFetch<unknown>({ path: "/v1/public/landing" });
  return LandingResponseSchema.parse(response).data;
}

export async function getPosts(params: PostQuery = {}): Promise<Paginated<PostSummary>> {
  const { page = 1, limit = 10, tag, featured } = params;

  if (isMockMode()) {
    let items = publishedPosts();
    if (tag) {
      items = items.filter((post) => post.tags.some((item) => item.slug === tag));
    }
    if (featured !== undefined) {
      items = items.filter((post) => post.featured === featured);
    }
    return paginate(items, page, limit);
  }

  const response = await cmsFetch<unknown>({
    path: "/v1/public/posts",
    query: { page, limit, tag, featured },
  });
  return PaginatedPostsSchema.parse(response);
}

export async function getAllPosts(): Promise<PostSummary[]> {
  if (isMockMode()) {
    return publishedPosts();
  }

  const all: PostSummary[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const response = await getPosts({ page, limit: 50 });
    all.push(...response.data);
    hasNext = response.meta.has_next;
    page += 1;
  }

  return all;
}

export async function getPostBySlug(slug: string): Promise<Post> {
  if (isMockMode()) {
    const post = mockPosts.find(
      (item) => item.slug === slug && item.publish_status === "published",
    );
    if (!post) {
      throw new CmsError(`Post no encontrado: ${slug}`, 404);
    }
    return PostSchema.parse(post);
  }

  const response = await cmsFetch<unknown>({ path: `/v1/public/posts/${slug}` });
  return PostResponseSchema.parse(response).data;
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<PostSummary[]> {
  if (isMockMode()) {
    const current = publishedPosts().find((post) => post.slug === slug);
    if (!current) {
      return [];
    }

    const currentTags = new Set(current.tags.map((tag) => tag.slug));
    const scored = publishedPosts()
      .filter((post) => post.slug !== slug)
      .map((post) => ({
        post,
        score: post.tags.filter((tag) => currentTags.has(tag.slug)).length,
      }))
      .sort((a, b) => b.score - a.score || Date.parse(b.post.published_at) - Date.parse(a.post.published_at));

    return scored.slice(0, limit).map((item) => item.post);
  }

  const response = await cmsFetch<unknown>({
    path: `/v1/public/posts/${slug}/related`,
    query: { limit },
  });
  return RelatedResponseSchema.parse(response).data;
}

export async function getProjects(params: ProjectQuery = {}): Promise<Paginated<ProjectSummary>> {
  const { page = 1, limit = 20, featured } = params;

  if (isMockMode()) {
    let items = publishedProjects();
    if (featured !== undefined) {
      items = items.filter((project) => project.featured === featured);
    }
    return paginate(items, page, limit);
  }

  const response = await cmsFetch<unknown>({
    path: "/v1/public/projects",
    query: { page, limit, featured },
  });
  return PaginatedProjectsSchema.parse(response);
}

export async function getAllProjects(): Promise<ProjectSummary[]> {
  if (isMockMode()) {
    return publishedProjects();
  }

  const all: ProjectSummary[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const response = await getProjects({ page, limit: 50 });
    all.push(...response.data);
    hasNext = response.meta.has_next;
    page += 1;
  }

  return all;
}

export async function getProjectBySlug(slug: string): Promise<Project> {
  if (isMockMode()) {
    const project = mockProjects.find(
      (item) => item.slug === slug && item.publish_status === "published",
    );
    if (!project) {
      throw new CmsError(`Proyecto no encontrado: ${slug}`, 404);
    }
    return ProjectSchema.parse(project);
  }

  const response = await cmsFetch<unknown>({ path: `/v1/public/projects/${slug}` });
  return ProjectResponseSchema.parse(response).data;
}

export async function getTags(): Promise<Tag[]> {
  if (isMockMode()) {
    return countTags();
  }
  const response = await cmsFetch<unknown>({ path: "/v1/public/tags" });
  return TagsResponseSchema.parse(response).data;
}

export async function getTagBySlug(slug: string): Promise<{ tag: Tag; posts: PostSummary[] }> {
  if (isMockMode()) {
    const tag = countTags().find((item) => item.slug === slug);
    if (!tag) {
      throw new CmsError(`Tag no encontrado: ${slug}`, 404);
    }
    const posts = publishedPosts().filter((post) =>
      post.tags.some((item) => item.slug === slug),
    );
    return { tag, posts };
  }

  const response = await cmsFetch<unknown>({ path: `/v1/public/tags/${slug}` });
  return TagResponseSchema.parse(response).data;
}

export async function getRedirects(): Promise<Redirect[]> {
  if (isMockMode()) {
    return [];
  }
  const response = await cmsFetch<unknown>({ path: "/v1/public/redirects" });
  return RedirectsResponseSchema.parse(response).data;
}

export type { PostQuery, ProjectQuery };
