<?php

namespace App\Http\Controllers;

use App\Models\DocumentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;



class DocumentRequestController extends Controller
{
    public function index() 
    {
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

    public function show(DocumentRequest $document_request) {
        dd($document_request->getAttributes());
    }
}
