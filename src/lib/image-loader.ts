import type { ImageLoaderProps } from "next/image";

const UNSPLASH_HOSTNAME = "images.unsplash.com";

/**
 * Build responsive Unsplash/Imgix URLs in the browser instead of proxying the
 * images through Next.js. The latter can time out when the Node process cannot
 * reach the remote origin, even though the user's browser can.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (src.startsWith("/")) {
    return src;
  }

  const url = new URL(src);

  if (url.hostname !== UNSPLASH_HOSTNAME) {
    return src;
  }

  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", url.searchParams.get("fit") ?? "crop");
  url.searchParams.set("w", width.toString());
  url.searchParams.set("q", (quality ?? 75).toString());

  return url.toString();
}
