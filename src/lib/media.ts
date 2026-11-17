import type { ImageMetadata } from "astro";
import type { Media } from "@/data/schemas";
import { localAsset } from "./images";

export function mediaSource(media: Media | null | undefined): ImageMetadata | string | null {
  if (!media) return null;
  return localAsset(media.id) ?? media.url;
}

export function isPortraitMedia(media: Media): boolean {
  return media.height / media.width > 1.15;
}
