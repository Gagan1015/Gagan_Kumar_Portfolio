<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    /**
     * Display a listing of skills.
     */
    public function index(Request $request)
    {
        $query = Skill::published()->ordered();

        // Filter by category if provided
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        $skills = $query->get();

        // Group by category if requested
        if ($request->has('grouped') && $request->grouped) {
            $grouped = $skills->groupBy('category')->map(function ($items) {
                return SkillResource::collection($items);
            });
            return response()->json(['data' => $grouped]);
        }

        return SkillResource::collection($skills);
    }

    /**
     * Display the specified skill.
     */
    public function show(string $id)
    {
        $skill = Skill::published()->findOrFail($id);

        return new SkillResource($skill);
    }
}
