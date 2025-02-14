<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['upload_id', 'platform_name', 'caption', 'status', 'posted_at'];

    public function upload()
    {
        return $this->belongsTo(Upload::class);
    }
}
