<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appeal extends Model
{
    /** @use HasFactory<\Database\Factories\AppealFactory> */
    use HasFactory;


    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function penalty()
    {
        return $this->belongsTo(Penalty::class);
    }
}
