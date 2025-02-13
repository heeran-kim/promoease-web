<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2-48',
            'caption' => 'required|string',
        ]);

        $path = $request->file('image')->store('uploads', 'public');

        return response()->json([
            'message' => 'Uploaded Successfully!',
            'path' => $path,
        ]);
    }   

    public function generateCaption(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        $generatedCaption = "Example Caption";

        return response()->json(['caption' => $generatedCaption]);
    }
}
