<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        return response()->json(
            Post::with('upload')->latest()->paginate(6) // ✅ 6 posts per page
        );
        // TODO: Auth info needed
    }
}
