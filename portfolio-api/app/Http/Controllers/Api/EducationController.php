<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EducationResource;
use App\Models\Education;

class EducationController extends Controller
{
    /**
     * Display a listing of education records.
     */
    public function index()
    {
        $education = Education::published()
            ->ordered()
            ->get();

        return EducationResource::collection($education);
    }

    /**
     * Display the specified education record.
     */
    public function show(string $id)
    {
        $education = Education::published()->findOrFail($id);

        return new EducationResource($education);
    }
}
