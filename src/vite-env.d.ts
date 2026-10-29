/// <reference types="vite/client" />

/** Built by the content-index plugin in vite.config.ts. */
declare module "virtual:content-index" {
  export const SECTOR_LINKS: { slug: string; name: string }[];
  export const HAS_GUIDES: boolean;
}

/** Keys of the images shipped in /img/ (image-pipeline plugin, scripts/build-images.mjs). */
declare module "virtual:image-manifest" {
  const keys: string[];
  export default keys;
}
