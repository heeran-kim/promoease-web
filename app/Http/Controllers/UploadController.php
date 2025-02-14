<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Upload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Http;
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
            Log::info("📂 File stored at: " . $path);

            $upload = Upload::create([
                'user_id' => Auth::id(),
                'image_path' => $path,
            ]);

            Log::info("✅ Upload saved to database!", ['upload_id' => $upload->id, 'image_path' => $upload->image_path]);

            return response()->json([
                'message' => 'Image uploaded successfully!',
                'upload_id' => $upload->id,
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
                'upload_id' => 'required|exists:uploads,id',
                'captions' => 'required|array',
                'platforms' => 'required|array',
            ]);

            Log::info("✅ Validation passed!");

            $upload = Upload::find($validated['upload_id']);
            if (!$upload) {
                return response()->json(['error' => 'Image not found in uploads.'], 404);
            }

            $posts = [];
            foreach ($validated['platforms'] as $platform) {
                if (!isset($validated['captions'][$platform])) {
                    return response()->json(['error' => "Caption is required for $platform."], 422);
                }
                $caption = $validated['captions'][$platform];

                $post = Post::create([
                    'upload_id' => $upload->id,
                    'platform_name' => $platform,
                    'caption' => $caption,
                    'status' => 'pending',
                ]);

                // $apiResponse = Http::post("https://api.$platform.com/post", [
                //     'image_url' => asset("storage/" . $upload->image_path),
                //     'caption' => $caption,
                // ]);
    
                // if ($apiResponse->successful()) {
                    Log::info("✅ Successfully posted to $platform: " . $caption);
                    $post->update(['status' => 'posted']);
                // } else {
                //     Log::error("❌ Failed to post to $platform: " . $caption);
                //     $post->update(['status' => 'failed']);
                // }
    
                $posts[] = $post;
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
