<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function() {
    Route::get('/dashboard', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');
    Route::get('/upload', [UploadController::class, 'index']);
    Route::post('/upload', [UploadController::class, 'store']);
    Route::post('/publish', [UploadController::class, 'publishToSocialMedia']);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
