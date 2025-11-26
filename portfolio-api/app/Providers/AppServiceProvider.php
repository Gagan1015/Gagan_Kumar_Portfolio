<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;
use CloudinaryLabs\CloudinaryLaravel\CloudinaryStorageAdapter;
use Cloudinary\Cloudinary;

class AppServiceProvider extends ServiceProvider
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
        // Force HTTPS in production
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }

        // Override Cloudinary disk to ensure proper PDF upload
        Storage::extend('cloudinary', function ($app, $config) {
            $client = new Cloudinary([
                'cloud' => [
                    'cloud_name' => $config['cloud'],
                    'api_key' => $config['key'],
                    'api_secret' => $config['secret'],
                    'secure' => $config['secure'] ?? true,
                ],
            ]);

            $adapter = new CloudinaryStorageAdapter($client);

            return new Filesystem($adapter, ['disable_asserts' => true]);
        });
    }
}
