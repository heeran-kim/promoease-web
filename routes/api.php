<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UploadController;

Route::post('/generate-caption', [UploadController::class, 'generateCaption']);
Route::post('/upload', [UploadController::class, 'store']);
Route::post('/publish', [UploadController::class, 'publishToSocialMedia']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
