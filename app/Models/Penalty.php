<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\DocumentRequest;


class Penalty extends Model
{
    //

    protected $guarded = [];


    public function user() {
        return $this->belongsTo(User::class);
    } 

    public function document_request() {
        return $this->belongsTo(DocumentRequest::class);
    }

}