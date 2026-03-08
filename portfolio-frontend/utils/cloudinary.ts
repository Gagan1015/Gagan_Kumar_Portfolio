/**
 * Optimize a Cloudinary image URL by adding transformation parameters.
 * Converts images to auto-format (WebP/AVIF), auto-quality, and resizes.
 *
 * Example:
 *   Input:  https://res.cloudinary.com/.../upload/v123/image.png
 *   Output: https://res.cloudinary.com/.../upload/f_auto,q_auto,w_800/v123/image.png
 */
export function optimizeCloudinaryUrl(
    url: string,
    width: number = 800,
    quality: string = 'auto'
): string {
    if (!url || !url.includes('res.cloudinary.com')) {
        return url;
    }
    // Avoid double-transforming
    if (url.includes('f_auto') || url.includes('q_auto')) {
        return url;
    }
    return url.replace(
        '/upload/',
        `/upload/f_auto,q_${quality},w_${width}/`
    );
}
