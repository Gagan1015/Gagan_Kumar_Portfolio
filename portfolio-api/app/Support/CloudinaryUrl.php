<?php

namespace App\Support;

class CloudinaryUrl
{
    public static function image(?string $path): ?string
    {
        return self::asset($path, 'image');
    }

    public static function raw(?string $path): ?string
    {
        return self::asset($path, 'raw');
    }

    public static function resume(?string $path): ?string
    {
        return self::delivery($path, 'raw');
    }

    public static function resumeAttachment(?string $path): ?string
    {
        return self::delivery($path, 'raw', ['fl_attachment']);
    }

    private static function asset(?string $path, string $resourceType): ?string
    {
        return self::delivery($path, $resourceType);
    }

    private static function delivery(?string $path, string $defaultResourceType, array $transformations = []): ?string
    {
        if (! $path) {
            return null;
        }

        $isUrl = str_starts_with($path, 'http://') || str_starts_with($path, 'https://');

        if ($isUrl && ! str_contains(parse_url($path, PHP_URL_HOST) ?: '', 'res.cloudinary.com')) {
            return $path;
        }

        $cloudName = config('filesystems.disks.cloudinary.cloud') ?: self::cloudNameFromUrl();

        if (! $cloudName) {
            return null;
        }

        $protocol = config('filesystems.disks.cloudinary.secure', true) ? 'https' : 'http';
        [$resourceType, $deliveryPath] = self::parseDeliveryPath($path, $cloudName, $defaultResourceType);
        $segments = array_values(array_filter([...$transformations, ...explode('/', $deliveryPath)], static fn ($segment): bool => $segment !== ''));
        $encodedPath = implode('/', array_map('rawurlencode', $segments));

        return "{$protocol}://res.cloudinary.com/{$cloudName}/{$resourceType}/upload/{$encodedPath}";
    }

    /**
     * Accepts public IDs, full Cloudinary URLs, and copied Cloudinary URL paths.
     *
     * @return array{0: string, 1: string}
     */
    private static function parseDeliveryPath(string $path, string $cloudName, string $defaultResourceType): array
    {
        $urlPath = parse_url($path, PHP_URL_PATH) ?: $path;
        $segments = array_values(array_filter(explode('/', trim($urlPath, '/')), static fn ($segment): bool => $segment !== ''));

        if (($segments[0] ?? null) === $cloudName) {
            array_shift($segments);
        }

        if (in_array($segments[0] ?? null, ['image', 'raw', 'video'], true) && ($segments[1] ?? null) === 'upload') {
            $resourceType = array_shift($segments);
            array_shift($segments);

            if (($segments[0] ?? null) === 'fl_attachment') {
                array_shift($segments);
            }

            return [$resourceType, implode('/', $segments)];
        }

        return [$defaultResourceType, implode('/', $segments)];
    }

    private static function cloudNameFromUrl(): ?string
    {
        $cloudinaryUrl = config('filesystems.disks.cloudinary.url') ?: env('CLOUDINARY_URL');

        if (! $cloudinaryUrl) {
            return null;
        }

        return parse_url($cloudinaryUrl, PHP_URL_HOST) ?: null;
    }
}
