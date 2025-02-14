<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Upload extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'image_path'];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
