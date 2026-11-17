import type { Author, Post, Project, SiteSettings } from "@/data/schemas";

type JsonLd = Record<string, unknown>;

function socialUrls(author: Author): string[] {
  return [author.github_url, author.linkedin_url].filter((url): url is string => Boolean(url));
}

export function personJsonLd(site: SiteSettings): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.author.name,
    alternateName: site.author.alias ?? "Ryoko",
    url: site.url,
    jobTitle: "Full Stack Developer",
    sameAs: socialUrls(site.author),
    knowsAbout: ["Full stack development", "Zero Trust", "Astro", "FastAPI", "Kotlin"],
  };
}

export function websiteJsonLd(site: SiteSettings): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.site_name,
    url: site.url,
    description: site.description,
    inLanguage: site.locale,
    author: { "@type": "Person", name: site.author.name },
  };
}

export function blogPostingJsonLd(post: Post, url: string, site: SiteSettings): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    inLanguage: site.locale,
    url,
    mainEntityOfPage: url,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: site.url,
    },
    keywords: post.tags.map((tag) => tag.name).join(", "),
    wordCount: undefined,
  };
}

export function projectJsonLd(project: Project, url: string, site: SiteSettings): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    dateCreated: `${project.year}-01-01`,
    dateModified: project.updated_at,
    url,
    inLanguage: site.locale,
    creator: { "@type": "Person", name: site.author.name },
    codeRepository: project.repo_url ?? undefined,
    programmingLanguage: project.stack,
  };
}

export function collectionJsonLd(name: string, description: string, url: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    inLanguage: "es-MX",
  };
}

export function blogJsonLd(name: string, description: string, url: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name,
    description,
    url,
    inLanguage: "es-MX",
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
