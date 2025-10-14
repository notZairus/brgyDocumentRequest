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
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Enum;
use App\StatusEnum;



class DocumentRequestController extends Controller
{
    public function index() 
    {
        if (!Auth::user()->is_admin) {
            return redirect('/my-requests');
        }

        $pending = DocumentRequest::where('status', StatusEnum::PENDING)->get();
        $unpending = DocumentRequest::where('status', '!=', StatusEnum::PENDING)->get();
        $allDR = [...$pending, ...$unpending];

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
        $penalties = Auth::user()->penalties;

        if ($penalties && checkPenalty($penalties)) {
            return back()->with('error', [
                'message' => 'You have an active penalty. Please wait for ' . ceil(checkPenalty($penalties)) . ' day(s) before making a new request.',
                'penalty_id' => $penalties->sortByDesc('created_at')->first()->id
            ]);
        }

        return Inertia::render('document-requests/create');
    }

    public function store(Request $request) {
    
        if ($request->get('document_request_type') === 'other') {
            if (! $request->get('brgyIdBack')) {
                return back()->with('error', 'Please upload the back of your Barangay ID.');
            }

            if (! $request->get('brgyIdFront')) {
                return back()->with('error', 'Please upload the front of your Barangay ID.');
            }

            if (! $request->get('name')) {
                return back()->with('error', 'Please enter your full name.');
            }

            if (! $request->get('sitio')) {
                return back()->with('error', 'Please enter your sitio.');
            }

            $extension = $request->file('brgyIdFront')['file']->getClientOriginalExtension();

            $request->file('brgyIdFront')['file']->storeAs(
                'ids/'. $request->user()->getAttribute('email') . '/' . $request->get('name'), 
                'front.' . $extension,
            );

            $request->file('brgyIdBack')['file']->storeAs(
                'ids/' . $request->user()->getAttribute('email')  . '/' . $request->get('name'),
                'back.' . $extension,
            );
        }

        switch ($request->get('document_type')) {
            case 'Certificate of Indigency':
                handleCertificateOfIndigency($request);
                break;
            case 'Certificate of Residency':
                handleCertificateOfResidency($request);
                break;
            case 'Certificate of Employment':
                handleCertificateOfEmployment($request);
                break;
            case 'Barangay Clearance':
                handleBarangayClearance($request);
                break;
        }

        return back()->with('success', 'Document request submitted successfully.');
    }

    public function show(DocumentRequest $document_request, Request $request) 
    {
        $document_request->load('user');
        $document_request->load('penalty');

        if ($request->user()->getAttribute('is_admin')) {
            if ($document_request->status == StatusEnum::PENDING) 
            {
                ActivityLog::create([
                    'action' => 'Reviewed',
                    'admin_id' => Auth::user()->id,
                    'document_request_id' => $document_request->id,
                    'user_id' => $document_request->user_id,
                ]);

                $document_request->update([
                    'status' => StatusEnum::UNDER_REVIEW,
                    'updated_at' => now()
                ]);
            }
        }

        return Inertia::render('document-requests/show', [
            'documentRequest' => $document_request,
            'activityLog' => ActivityLog::where('document_request_id', $document_request->id)->where('action', 'Declined')->with('user')->first(),
            'hasPenalty' => $document_request->penalty ? true : false,
        ]);
    }

    public function update(DocumentRequest $document_request, Request $request) 
    {
        if ($request->method() === 'PATCH') {
            $document_request->document_details = $request->all();
            $document_request->save();
            return back()->with('success', 'Document details updated successfully.');
        } else {
            $status = StatusEnum::From($request->get('action'));

            if (!$status) {
                return back()->with('error', 'Invalid action.');
            }

            $document_request->update([
                'status' => $status->value,
                'updated_at' => now()
            ]);

            $document_request->load('user');

            ActivityLog::create([
                'action' => $request->get('action'),
                'admin_id' => Auth::user()->id,
                'reason' => $request->get('reason') ? $request->get('reason') : null,
                'document_request_id' => $document_request->id,
                'user_id' => $document_request->user_id,
            ]);

            Mail::to($document_request->user->email)->queue(new DocumentRequestReviewed($document_request));

            return redirect('/document-requests/' . $document_request->id)->with('success', 'Document request ' . $status->value . ' successfully.');
        }
    }
}












// HELPER FUNCTIONSSSS // HELPER FUNCTIONSSSS // HELPER FUNCTIONSSSS // HELPER FUNCTIONSSSS // HELPER FUNCTIONSSSS // HELPER FUNCTIONSSSS // HELPER FUNCTIONSSSS //



function checkPenalty($penalties) {
    $there_is_penalty = false;

    if ($penalties->isNotEmpty()) {
        $latest_penalty = $penalties->sortByDesc('created_at')->first();

        $there_is_penalty = $latest_penalty->status === 'effective';

        if (! $there_is_penalty) {
            return null;
        }

        $now = Carbon::now();
        $end = Carbon::parse($latest_penalty->created_at)->addDays(count($penalties) * 3);
        
        if ($now->lessThan($end)) {
            $days_left = $now->diffInDays($end);
            return $days_left;
        }
    }

    return null;
}



function handleCertificateOfIndigency(Request $request) 
{
    $validated_data = $request->validate([
        "document_type" => ['required'],
        "purpose" => ['required'],
    ]);
    
    createDocumentRequest($request);
}

function handleCertificateOfResidency(Request $request) 
{
    $validated_data = $request->validate([
        "document_type" => ['required'],
        "civil_status" => ['required'],
    ]);

    createDocumentRequest($request);
}

function handleCertificateOfEmployment(Request $request) 
{
    $validated_data = $request->validate([
        "document_type" => ['required'],
        "income" => ['required'],
        "occupation" => ['required'],
    ]);

    createDocumentRequest($request);
}

function handleBarangayClearance(Request $request) 
{
    $validated_data = $request->validate([
        "document_type" => ['required'],
        "civil_status" => ['required'],
        "purpose" => ['required'],
    ]);

    createDocumentRequest($request);
}



function createDocumentRequest(Request $request) {
    DocumentRequest::create([
        'user_id' => $request->user()->id,
        'document_type' => $request['document_type'],
        'notes' => $request->note,
        'price' => $request->price,
        'document_details' => [
            'sitio' => $request->get('sitio') ? $request->get('sitio') : $request->user()->sitio,
            'name' => $request->get('name') ? $request->get('name') : $request->user()->name,
            'purpose' => $request['purpose'] === 'other' ? $request['other_purpose'] : $request['purpose'],
            'civil_status' => $request['civil_status'],
        ],
    ]);
}