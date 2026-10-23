export const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';

/**
 * Safely resolves a product image URL from either a string or a backend image object { url, altText }.
 */
export function getProductImage(product, index = 0) {
  if (!product) return FALLBACK_PRODUCT_IMAGE;

  // Check images array first
  if (Array.isArray(product.images) && product.images.length > index) {
    const item = product.images[index];
    if (typeof item === 'string' && item.trim()) return item;
    if (item && typeof item === 'object' && item.url) return item.url;
  }

  // Fallback to first image in array if specified index out of bounds
  if (Array.isArray(product.images) && product.images.length > 0) {
    const first = product.images[0];
    if (typeof first === 'string' && first.trim()) return first;
    if (first && typeof first === 'object' && first.url) return first.url;
  }

  // Check product.image single property
  if (typeof product.image === 'string' && product.image.trim()) return product.image;
  if (product.image && typeof product.image === 'object' && product.image.url) return product.image.url;

  return FALLBACK_PRODUCT_IMAGE;
}

/**
 * Normalizes a product object so that product.images is always an array of string URLs
 * and product.image is the primary image URL string.
 */
export function normalizeProduct(product) {
  if (!product || typeof product !== 'object') return product;

  let rawImages = [];
  if (Array.isArray(product.images)) {
    rawImages = product.images;
  } else if (product.image) {
    rawImages = [product.image];
  }

  const normalizedImages = rawImages.map(img => {
    if (typeof img === 'string' && img.trim()) return img;
    if (img && typeof img === 'object' && img.url) return img.url;
    return FALLBACK_PRODUCT_IMAGE;
  });

  if (normalizedImages.length === 0) {
    normalizedImages.push(FALLBACK_PRODUCT_IMAGE);
  }

  return {
    ...product,
    images: normalizedImages,
    image: normalizedImages[0]
  };
}
