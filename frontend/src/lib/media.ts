/** Largest photo or video the admin panel uploads: 40 GB (matches the API). */
export const MAX_UPLOAD_BYTES = 40 * 1024 ** 3;

const IMAGE_EXT = /\.(jpe?g|jfif|png|gif|webp|avif|heic|heif|bmp|tiff?|svg|ico)$/i;
const VIDEO_EXT = /\.(mp4|m4v|mov|webm|mkv|avi|wmv|flv|mpe?g|3gp|3g2|ogv|mts|m2ts|ts)$/i;

/**
 * Accepts any photo or video, whatever its shape (9:16, 16:9, square…) or
 * container. Browsers leave `file.type` empty for some formats (.mkv, .heic),
 * so the extension counts too.
 */
export function isMediaOfKind(file: File, kind: 'image' | 'video'): boolean {
  if (file.type.startsWith(`${kind}/`)) return true;
  return (kind === 'image' ? IMAGE_EXT : VIDEO_EXT).test(file.name);
}

export function formatBytes(n: number): string {
  if (n >= 1024 ** 3) return `${(n / 1024 ** 3).toFixed(1)} GB`;
  if (n >= 1024 ** 2) return `${Math.round(n / 1024 ** 2)} MB`;
  return `${Math.max(1, Math.round(n / 1024))} KB`;
}
