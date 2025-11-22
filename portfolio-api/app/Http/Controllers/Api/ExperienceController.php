<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExperienceResource;
use App\Models\Experience;

class ExperienceController extends Controller
{
    /**
     * Display a listing of experiences.
     */
    public function index()
    {
        $experiences = Experience::published()
            ->ordered()
            ->get();

        return ExperienceResource::collection($experiences);
    }

    /**
     * Display the specified experience.
     */
    public function show(string $id)
    {
        $experience = Experience::published()->findOrFail($id);

        return new ExperienceResource($experience);
    }
}
