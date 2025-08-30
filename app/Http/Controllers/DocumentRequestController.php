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
        return Inertia::render('document-requests/create1');
    }

    public function store(Request $request) {
        switch ($request->get('document_type')) {
            case 'Certificate of Indigency':
                handleCertificateOfIndigency($request);
                break;
            case 'Certificate of Residency':
                handleCertificateOfResidency($request);
                break;
        }

        return back()->with('success', 'Document request submitted successfully.');
    }



//     document_type: string;
//     purpose: string;
//     notes: string;
//     preferred_pickup: string;

//     name?: string;
//     brgyIdFront?: IdType | File | null;
//     brgyIdBack?: IdType | File | null;

//     // delivery feature (experimental)
//     delivery_method: DeliveryMethod;
//     delivery_address: string | null;
//     total?: number;

    // public function store(Request $request) 
    // {
    //     if (! $request->get('name')) {
    //         $validated_data = $request->validate([
    //             "preferred_pickup" => ['required', 'date'],
    //             "document_type" => ['required'],
    //             "purpose" => ['required'],
    //             "name" => [],
    //             "total" => []
    //         ]);

    //         $new_doc_req = DocumentRequest::create([
    //             'user_id' => $request->user()->id,
    //             'name' => $validated_data['name'] ? $validated_data['name'] : $request->user()->getAttribute('name'),
    //             'document_type' => $validated_data['document_type'],
    //             'purpose' => $validated_data['purpose'],
    //             'notes' => $request->notes,
    //             'preferred_pickup' => new \DateTime($request->preferred_pickup),
    //             'total_amount' => $validated_data['total'],
    //         ]);

    //         return back()->with('success', 'Document request submitted successfully.');
    //     }


    //     $validated_data = $request->validate([
    //         "document_type" => ['required'],
    //         "preferred_pickup" => ['required', 'date'],
    //         "purpose" => ['required'],

    //         "name" => ['required'],
    //         "brgyIdFront" => ['required'],
    //         "brgyIdBack" => ['required'],

    //         "total" => []
    //     ]);

    //     $extension = $request->file('brgyIdFront')['file']->getClientOriginalExtension();

    //     $request->file('brgyIdFront')['file']->storeAs(
    //         'ids/'. $request->user()->getAttribute('email') . '/' . $validated_data['name'], 
    //         'front.' . $extension,
    //     );

    //     $request->file('brgyIdBack')['file']->storeAs(
    //         'ids/' . $request->user()->getAttribute('email')  . '/' . $validated_data['name'],
    //         'back.' . $extension,
    //     );

    //     $new_doc_req = DocumentRequest::create([
    //         'user_id' => $request->user()->id,
    //         'name' => $validated_data['name'] ? $validated_data['name'] : $request->user()->getAttribute('name'),
    //         'document_type' => $validated_data['document_type'],
    //         'purpose' => $validated_data['purpose'],
    //         'notes' => $request->notes,
    //         'preferred_pickup' => new \DateTime($request->preferred_pickup),
    //         'total_amount' => $validated_data['total'],
    //     ]);
 
    //     return back()->with('success', 'Document request submitted successfully.');
    // }

    public function show(DocumentRequest $document_request, Request $request) 
    {
        $document_request->load('user');
        $document_request->load('penalty');

        if ($request->user()->getAttribute('is_admin')) {
            if ($document_request->status == StatusEnum::PENDING) 
            {
                ActivityLog::create([
                    'action' => 'Reviewed',
                    'user_id' => Auth::user()->id,
                    'document_request_id' => $document_request->id,
                ]);

                $document_request->update([
                    'status' => StatusEnum::UNDER_REVIEW,
                    'updated_at' => now()
                ]);
            }
        }

        return Inertia::render('document-requests/show', [
            'documentRequest' => $document_request,
            'hasPenalty' => $document_request->penalty ? true : false,
        ]);
    }

    public function update(DocumentRequest $document_request, Request $request) 
    {
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
            'user_id' => Auth::user()->id,
            'reason' => $request->get('reason') ? $request->get('reason') : null,
            'document_request_id' => $document_request->id,
        ]);

        Mail::to($document_request->user->email)->queue(new DocumentRequestReviewed($document_request));

        return redirect('/document-requests/' . $document_request->id)->with('success', 'Document request ' . $status->value . ' successfully.');
    }
}












// HELPER FUNCTIONSSSS // HELPER FUNCTIONSSSS // HELPER FUNCTIONSSSS // HELPER FUNCTIONSSSS // HELPER FUNCTIONSSSS // HELPER FUNCTIONSSSS // HELPER FUNCTIONSSSS //





function handleCertificateOfIndigency(Request $request) 
{
    if ($request->get('document_request_type') === 'user') {
        $validated_data = $request->validate([
            "document_type" => ['required'],
            "purpose" => ['required'],
            "sitio" => ['required'],
        ]);

        $new_doc_req = DocumentRequest::create([
            'user_id' => $request->user()->id,
            'document_type' => $validated_data['document_type'],
            'notes' => $request->notes,
            'document_details' => [
                'sitio' => $validated_data['sitio'],
                'name' => $request->user()->name,
                'purpose' => $validated_data['purpose'],
            ],
        ]);
    } else {
        
    }
}

function handleCertificateOfResidency(Request $request) 
{
    if ($request->get('document_request_type') === 'user') {
        $validated_data = $request->validate([
            "document_type" => ['required'],
            "sitio" => ['required'],
            "civil_status" => ['required'],
        ]);

        $new_doc_req = DocumentRequest::create([
            'user_id' => $request->user()->id,
            'document_type' => $validated_data['document_type'],
            'notes' => $request->notes,
            'document_details' => [
                'sitio' => $validated_data['sitio'],
                'name' => $request->user()->name,
                'civil_status' => $validated_data['civil_status'],
            ],
        ]);
    } else {
        
    }
}