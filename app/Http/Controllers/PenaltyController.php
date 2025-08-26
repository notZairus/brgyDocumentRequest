<?php

namespace App\Http\Controllers;

use App\Models\Penalty;
use Illuminate\Http\Request;

class PenaltyController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $newPenalty = Penalty::create([
            'user_id' => $request->user_id,
            'document_request_id' => $request->document_request_id,
            'reason' => $request->reason
        ]);

        return redirect()->back();
    }
}
