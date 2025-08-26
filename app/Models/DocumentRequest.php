<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\StatusEnum;

use App\Models\User;
use App\Models\Penalty;


class DocumentRequest extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentRequestFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'status' => StatusEnum::class
    ];


    public function user() {
        return $this->belongsTo(User::class);
    }

    public function penalty() {
        return $this->hasOne(Penalty::class);
    }
}
