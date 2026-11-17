const OPTIMIZABLE_IMAGE_HOSTS = new Set(['i.postimg.cc', 'images.unsplash.com']);

export function isOptimizableImage(src: string): boolean {
  if (src.startsWith('/')) return true;
  try {
    return OPTIMIZABLE_IMAGE_HOSTS.has(new URL(src).hostname);
  } catch {
    return false;
  }
}
