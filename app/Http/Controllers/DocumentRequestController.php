<?php

namespace App\Http\Controllers;

use App\Models\DocumentRequest;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\DocumentRequestReviewed;



class DocumentRequestController extends Controller
{
    public function index() 
    {
        if (!Auth::user()->is_admin) {
            return redirect('/my-requests');
        }

        $allDR = DocumentRequest::with('user')->get();

        $mapped = collect($allDR)->map(function ($rd) {
            $rd->user_name = $rd->user->name;
            return $rd;
        });

        return Inertia::render('document-requests/index', [
            'documentRequests' => $mapped
        ]);
    }

    public function create()
    {
        return Inertia::render('document-requests/create');
    }

    public function store(Request $request) 
    {
        $validated_data = $request->validate([
            "document_type" => ['required'],
            "purpose" => ['required'],
        ]);
        
        $new_doc_req = DocumentRequest::create([
            'user_id' => $request->user()->id,
            'document_type' => $validated_data['document_type'],
            'purpose' => $validated_data['purpose'],
            'notes' => $request->notes,
            'preferred_pickup' => new \DateTime($request->preferred_pickup),
        ]);

        return back()->with('success', 'Document request submitted successfully.');
    }

    public function show(DocumentRequest $document_request) 
    {
        if ($document_request->status != "Pending") {
            $document_request->load('user');
            return Inertia::render('document-requests/show', [
                'documentRequest' => $document_request
            ]);
        }

        ActivityLog::create([
            'action' => 'Reviewed',
            'user_id' => Auth::user()->id,
            'document_request_id' => $document_request->id,
        ]);

        $document_request->update([
            'status' => 'Under Review',
            'updated_at' => now()
        ]);

        $document_request->load('user');

        return Inertia::render('document-requests/show', [
            'documentRequest' => $document_request
        ]);
    }

    public function update(DocumentRequest $document_request, Request $request) 
    {
        $document_request->update([
            'status' => $request->get('action') ? $request->get('action') : "Approved",
            'updated_at' => now()
        ]);

        $document_request->load('user');

        ActivityLog::create([
            'action' => $request->get('action'),
            'user_id' => Auth::user()->id,
            'reason' => $request->get('reason') ? $request->get('reason') : null,
            'document_request_id' => $document_request->id,
        ]);

        Mail::to($document_request->user->email)->queue(new DocumentRequestReviewed($document_request));

        return redirect('/document-requests');
    }
}
