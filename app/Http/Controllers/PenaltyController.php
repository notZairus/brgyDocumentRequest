<?php

namespace App\Http\Controllers;

use App\Models\Penalty;
use Illuminate\Http\Request;
use App\StatusEnum;

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
        $doc_req = \App\Models\DocumentRequest::find($request->document_request_id);

        $doc_req->update([
            'status' => $doc_req->status === StatusEnum::UNDER_REVIEW ? StatusEnum::DECLINED : StatusEnum::COMPLETED,
            'updated_at' => now(),
        ]);

        $newPenalty = Penalty::create([
            'user_id' => $request->user_id,
            'document_request_id' => $request->document_request_id,
            'reason' => $request->reason
        ]);

        return redirect()->back();
    }
}
