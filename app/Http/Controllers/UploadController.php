<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        Log::info("🔥 store() called!");
        Log::info("📥 Received request data:", $request->all());

        try{
            $request->validate([
                'image' => 'required|image|max:2048',
            ]);

            Log::info("✅ Validation passed!");

            $path = $request->file('image')->store('uploads', 'public');

            return response()->json([
                'message' => 'Uploaded Successfully!',
                'path' => $path,
            ]);
        } catch (ValidationException $e) {
            Log::error("❌ Validation Error:", $e->errors());
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error("❌ Unexpected Error:", ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Something went wrong.'], 500);
        }
    }   

    public function publishToSocialMedia(Request $request)
    {
        Log::info("🔥 publishToSocialMedia() called!");
        Log::info("📥 Received request data:", $request->all());

        try{
            $validated = $request->validate([
                'image_path' => 'required|string',
                'captions' => 'required|array',
                'platforms' => 'required|array',
            ]);

            Log::info("✅ Validation passed!");

            foreach ($validated['platforms'] as $platform) {
                Log::info("Posting to $platform: " . $validated['captions'][$platform]);
            }

            return response()->json(['message' => 'Posted successfully!']);
        } catch (ValidationException $e) {
            Log::error("❌ Validation Error:", $e->errors());
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error("❌ Unexpected Error:", ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Something went wrong.'], 500);
        }
    }

    public function generateCaption(Request $request)
    {
        Log::info("🔥 generateCaption() called!");
        Log::info("📥 Received request data:", $request->all());

        try {
            $request->merge([
                'selectedPlatforms' => json_decode($request->input('selectedPlatforms'), true),
            ]);
            $request->validate([
                'image' => 'required|image|max:2048',
                'selectedPlatforms' => 'required|array|min:1',
                'selectedPlatforms.*' => 'string|in:twitter,instagram,facebook',
            ]);

            Log::info("✅ Validation passed!");

            $generatedCaption = "Example Caption for Platforms: " . implode(", ", $request->selectedPlatforms);

            return response()->json(['caption' => $generatedCaption]);
        } catch (ValidationException $e) {
            Log::error("❌ Validation Error:", $e->errors());
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error("❌ Unexpected Error:", ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Something went wrong.'], 500);
        }
    }
}
