<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    /**
     * Display a listing of settings.
     */
    public function index(): JsonResponse
    {
        $settings = Setting::all()->pluck('value', 'key');

        return response()->json([
            'data' => $settings,
        ]);
    }

    /**
     * Display the specified setting.
     */
    public function show(string $key): JsonResponse
    {
        $value = Setting::get($key);

        if ($value === null) {
            return response()->json([
                'message' => 'Setting not found',
            ], 404);
        }

        return response()->json([
            'data' => [
                'key' => $key,
                'value' => $value,
            ],
        ]);
    }
}
