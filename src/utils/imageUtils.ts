export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  quality?: number;
  fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
  progressive?: boolean;
}

/**
 * Optimizes Contentful image URLs with transformation parameters
 */
export function optimizeContentfulImage(
  url: string, 
  options: ImageOptimizationOptions = {}
): string {
  if (!url || !url.includes('ctfassets.net')) {
    return url;
  }

  const {
    width,
    height,
    format = 'webp',
    quality = 80,
    fit = 'fill',
    progressive = true
  } = options;

  const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
  const params = new URLSearchParams();

  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('fm', format);
  params.set('q', quality.toString());
  params.set('fit', fit);
  if (progressive) params.set('fl', 'progressive');

  urlObj.search = params.toString();
  return urlObj.toString();
}

/**
 * Generates responsive Contentful image sources for different viewport sizes
 */
export function generateContentfulResponsiveImages(
  url: string,
  breakpoints: { width: number; viewportWidth?: string }[] = [
    { width: 400, viewportWidth: '640px' },
    { width: 600, viewportWidth: '1024px' },
    { width: 800, viewportWidth: '1536px' },
    { width: 1200 }
  ]
) {
  const sources = breakpoints.map(bp => ({
    srcset: optimizeContentfulImage(url, { width: bp.width, format: 'avif' }) + ' 1x, ' +
            optimizeContentfulImage(url, { width: bp.width * 2, format: 'avif' }) + ' 2x',
    media: bp.viewportWidth ? `(max-width: ${bp.viewportWidth})` : undefined,
    type: 'image/avif'
  }));

  // Fallback WebP sources
  const webpSources = breakpoints.map(bp => ({
    srcset: optimizeContentfulImage(url, { width: bp.width, format: 'webp' }) + ' 1x, ' +
            optimizeContentfulImage(url, { width: bp.width * 2, format: 'webp' }) + ' 2x',
    media: bp.viewportWidth ? `(max-width: ${bp.viewportWidth})` : undefined,
    type: 'image/webp'
  }));

  return [...sources, ...webpSources];
}

/**
 * Gets optimal image size based on display dimensions
 */
export function getOptimalImageSize(displayWidth: number, displayHeight: number) {
  // Account for device pixel ratio and ensure we have enough resolution
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 2;
  const optimalWidth = Math.ceil(displayWidth * pixelRatio);
  const optimalHeight = Math.ceil(displayHeight * pixelRatio);
  
  return { width: optimalWidth, height: optimalHeight };
}

/**
 * Standard responsive breakpoints for most use cases
 */
export const RESPONSIVE_BREAKPOINTS = [
  { width: 375, viewportWidth: '480px' },   // Mobile
  { width: 576, viewportWidth: '768px' },   // Tablet portrait
  { width: 768, viewportWidth: '1024px' },  // Tablet landscape
  { width: 1024, viewportWidth: '1280px' }, // Desktop small
  { width: 1280, viewportWidth: '1536px' }, // Desktop medium
  { width: 1536 }                           // Desktop large
];