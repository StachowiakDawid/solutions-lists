<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solution extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'type',
        'content',
        'exercise_id'
    ];
}
