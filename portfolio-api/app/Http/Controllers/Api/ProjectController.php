<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request)
    {
        $query = Project::published()->ordered();

        // Filter by category if provided
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by featured if provided
        if ($request->has('featured')) {
            $query->featured();
        }

        $projects = $query->get();

        return ProjectResource::collection($projects);
    }

    /**
     * Display the specified project.
     */
    public function show(string $id)
    {
        $project = Project::published()->findOrFail($id);

        return new ProjectResource($project);
    }
}
