/**
 * Rewrite a Supabase Storage public object URL to the image-transform ("render")
 * endpoint so we download images near their display size instead of full
 * resolution. Verified enabled on this project (e.g. a 330 KB product photo
 * becomes ~35 KB at width 200). Leaves non-Supabase, signed, or empty URLs
 * untouched, so it's safe to wrap any `image_url`.
 *
 *   <img src={cdnImg(product.image_url, 600)} />
 */
export const cdnImg = (url: string, width: number, quality = 70): string => {
  const marker = "/storage/v1/object/public/";
  if (!url || !url.includes(marker)) return url;
  const rendered = url.replace(marker, "/storage/v1/render/image/public/");
  const sep = rendered.includes("?") ? "&" : "?";
  return `${rendered}${sep}width=${width}&quality=${quality}&resize=contain`;
};
