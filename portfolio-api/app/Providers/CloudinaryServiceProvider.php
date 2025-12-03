<?php

namespace App\Providers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;
use CloudinaryLabs\CloudinaryLaravel\CloudinaryAdapter;

class CloudinaryServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Storage::extend('cloudinary', function ($app, $config) {
            $adapter = new CloudinaryAdapter();
            
            // Override the adapter's putStream method to set resource_type to 'raw' for PDFs
            return new Filesystem($adapter, [
                'disable_asserts' => true,
                'resource_type' => 'raw', // Force raw resource type for non-image files
            ]);
        });
    }
}
