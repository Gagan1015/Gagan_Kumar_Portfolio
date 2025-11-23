# Cloudinary Setup Guide (FREE)

## Why Cloudinary?
- ✅ **FREE**: 25GB storage + 25GB bandwidth/month
- ✅ **Persistent**: Files don't disappear on Heroku dyno restarts
- ✅ **Fast CDN**: Global content delivery
- ✅ **Image optimization**: Automatic resizing, compression

---

## Setup Steps

### 1. Create Cloudinary Account
1. Go to https://cloudinary.com/users/register/free
2. Sign up (email verification required)
3. After login, go to **Dashboard** to see your credentials

### 2. Get Your Credentials
From the Cloudinary Dashboard, copy:
- **Cloud Name**: e.g., `dxyz123abc`
- **API Key**: e.g., `123456789012345`
- **API Secret**: e.g., `abcdefGHIJKLMNOPQRSTUVWXYZ123`

### 3. Add to Local `.env`
```env
FILESYSTEM_DISK=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Set Heroku Environment Variables
```bash
heroku config:set FILESYSTEM_DISK=cloudinary -a gagan-portfolio-api
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name -a gagan-portfolio-api
heroku config:set CLOUDINARY_API_KEY=your_api_key -a gagan-portfolio-api
heroku config:set CLOUDINARY_API_SECRET=your_api_secret -a gagan-portfolio-api
```

### 5. Update ProjectResource.php
Replace the `getImageUrl()` method to use Cloudinary URLs:

```php
protected function getImageUrl(): ?string
{
    if (!$this->image) {
        return null;
    }

    // If image is already a full URL (Cloudinary), return as-is
    if (str_starts_with($this->image, 'http')) {
        return $this->image;
    }

    // Check if file exists in storage
    if (Storage::disk('cloudinary')->exists($this->image)) {
        return Storage::disk('cloudinary')->url($this->image);
    }

    // Return placeholder if file doesn't exist
    $placeholders = [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
        'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
    ];
    
    return $placeholders[($this->id - 1) % count($placeholders)];
}
```

### 6. Deploy to Heroku
```bash
git add .
git commit -m "Add Cloudinary support for persistent file storage"
git push heroku master
```

---

## Testing File Upload

1. Go to https://gagan-portfolio-api-2fa9ad31e6bb.herokuapp.com/admin
2. Edit any project
3. Upload an image
4. Image will be stored on Cloudinary (permanent storage)
5. Check your Cloudinary Dashboard → Media Library to see uploaded files

---

## Free Alternatives Comparison

| Service | Free Storage | Free Bandwidth | Best For |
|---------|-------------|----------------|----------|
| **Cloudinary** | 25GB | 25GB/month | Images/Videos (RECOMMENDED) |
| **imgbb** | Unlimited | Unlimited | Images only (5MB limit per file) |
| **Backblaze B2** | 10GB | 1GB/day | General files (requires credit card) |
| **Supabase Storage** | 1GB | 2GB/month | General files (PostgreSQL included) |

---

## Current Status
- ✅ Cloudinary package installed
- ✅ Configuration added to `config/filesystems.php`
- ⏳ Waiting for your Cloudinary credentials
- ⏳ Need to update ProjectResource.php
- ⏳ Need to deploy to Heroku

---

## Need Help?
- Cloudinary Docs: https://cloudinary.com/documentation/php_integration
- Laravel Integration: https://github.com/cloudinary-labs/cloudinary-laravel
