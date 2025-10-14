<?php

namespace App\Http\Controllers;

use App\Models\Penalty;
use Illuminate\Http\Request;
use App\StatusEnum;
use App\Models\ActivityLog; 
use Illuminate\Support\Facades\Auth;

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
        $document_request = \App\Models\DocumentRequest::find($request->document_request_id);

        $document_request->update([
            'status' => $document_request->status === StatusEnum::UNDER_REVIEW ? StatusEnum::DECLINED : StatusEnum::COMPLETED,
            'updated_at' => now(),
        ]);

        $newPenalty = Penalty::create([
            'user_id' => $request->user_id,
            'document_request_id' => $document_request->id,
            'reason' => $request->reason
        ]);

        ActivityLog::create([
            'action' => 'Penalty Issued',
            'reason' => $request->get('reason'),
            'admin_id' => Auth::user()->id,
            'document_request_id' =>$document_request->id,
            'user_id' => $document_request->user_id,
        ]);

        return redirect()->back()->with('success', 'Penalty issued successfully.');
    }
}
