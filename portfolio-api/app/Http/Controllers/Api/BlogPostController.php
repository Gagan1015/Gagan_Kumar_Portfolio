<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;
use Illuminate\Http\Request;

class BlogPostController extends Controller
{
    /**
     * Display a listing of published blog posts.
     */
    public function index(Request $request)
    {
        $query = BlogPost::published()->ordered();

        // Filter by category if provided
        if ($request->has('category') && $request->category) {
            $query->byCategory($request->category);
        }

        // Filter by tag if provided
        if ($request->has('tag') && $request->tag) {
            $query->byTag($request->tag);
        }

        // Paginate results (default 12 per page)
        $perPage = $request->input('per_page', 12);
        $posts = $query->paginate($perPage);

        return BlogPostResource::collection($posts);
    }

    /**
     * Display the specified blog post by slug.
     */
    public function show(string $slug)
    {
        $post = BlogPost::published()
            ->where('slug', $slug)
            ->firstOrFail();

        return new BlogPostResource($post);
    }

    /**
     * Display featured blog posts.
     */
    public function featured(Request $request)
    {
        $limit = $request->input('limit', 3);

        $posts = BlogPost::published()
            ->featured()
            ->ordered()
            ->take($limit)
            ->get();

        return BlogPostResource::collection($posts);
    }

    /**
     * Get list of unique categories.
     */
    public function categories()
    {
        $categories = BlogPost::published()
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->sort()
            ->values();

        return response()->json([
            'data' => $categories,
        ]);
    }
}
