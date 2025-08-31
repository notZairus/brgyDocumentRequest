<?php 

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\VerifyUserController;
use App\Http\Controllers\PollingController;
use App\Http\Controllers\IdController;

use App\Models\User;
use App\Models\DocumentRequest;


Route::middleware(['auth', 'verified'])->group(function () {
    // serve the ids
    Route::get('/getId/{user}/front', [IdController::class, 'serveFrontId']);
    Route::get('/getId/{user}/back', [IdController::class, 'serveBackId']);
    Route::get('/getOtherId/{document_request}/front', [IdController::class, 'serveOtherFrontId']);
    Route::get('/getOtherId/{document_request}/back', [IdController::class, 'serveOtherBackId']);
    


    // data polling
    Route::get('/poll/unverified-accounts', [PollingController::class, 'getUnverifiedAccounts']);
    Route::get('/poll/document-requests', [PollingController::class, 'getDocumentRequests']);
    Route::get('/poll/dashboard-data', function () {
        $is_admin = Auth::user()->is_admin;

        if ($is_admin) {
            return response()->json([
                "totalRequests" => DocumentRequest::all()->count(),
                "totalVerifications" => User::where('verified_at', null)->where('is_admin', 0)->count(),
                "pendingRequests" => DocumentRequest::whereIn('status', ['Pending', 'Under Review'])->count(),
                'approvedToday' => DocumentRequest::where('status', 'Approved')->whereDate('updated_at', today())->count(),
                'declinedToday' => DocumentRequest::where('status', 'Declined')->whereDate('updated_at', today())->count(),
            ]);
        }

        return response()->json([
            "totalRequests" => DocumentRequest::where('user_id', Auth::user()->id)->count(),
            "completedRequests" => DocumentRequest::where('user_id', Auth::user()->id)->where('status', 'Completed')->count(),
            "pendingRequests" => DocumentRequest::where('user_id', Auth::user()->id)->whereIn('status', ['Pending', 'Under Review'])->count(),
        ]);
    }); 
});





use PhpOffice\PhpWord\TemplateProcessor;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Settings;
use ConvertApi\ConvertApi;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/download-docx/{document_request}', function(DocumentRequest $document_request) {
        $templatePath = null;
        $templateProcessor = null;

        if ($document_request->document_type === 'Certificate of Indigency') {
            $templatePath = storage_path('app/templates/indigency.docx');
            $templateProcessor = new TemplateProcessor($templatePath);

            $templateProcessor->setValue('name', $document_request['document_details']['name']);
            $templateProcessor->setValue('sitio', $document_request['document_details']['sitio']);
            $templateProcessor->setValue('purpose', strtoupper($document_request['document_details']['purpose']));
            $templateProcessor->setValue('date', date('jS \d\a\y \o\f F Y', strtotime($document_request['created_at'])));
        }

        if ($document_request->document_type === 'Certificate of Residency') {
            $templatePath = storage_path('app/templates/residency.docx');
            $templateProcessor = new TemplateProcessor($templatePath);

            $templateProcessor->setValue('name', $document_request['document_details']['name']);
            $templateProcessor->setValue('sitio', $document_request['document_details']['sitio']);
            $templateProcessor->setValue('civil_status', strtolower($document_request['document_details']['civil_status']));
            $templateProcessor->setValue('date', date('jS \d\a\y \o\f F Y', strtotime($document_request['created_at'])));
        }

        if ($document_request->document_type === 'Certificate of Employment') {
            $templatePath = storage_path('app/templates/employment.docx');
            $templateProcessor = new TemplateProcessor($templatePath);

            $name = $document_request['document_details']['name'];
            $temp = explode(' ', $name);
            $last_name = end($temp);

            $templateProcessor->setValue('name', $name);
            $templateProcessor->setValue('last_name', $last_name);
            $templateProcessor->setValue('sitio', $document_request['document_details']['sitio']);
            $templateProcessor->setValue('income', $document_request['document_details']['income']);
            $templateProcessor->setValue('occupation', $document_request['document_details']['occupation']);
            $templateProcessor->setValue('date', date('jS \d\a\y \o\f F Y', strtotime($document_request['created_at'])));
        }

        if ($document_request->document_type === 'Barangay Clearance') {
            $templatePath = storage_path('app/templates/clearance.docx');
            $templateProcessor = new TemplateProcessor($templatePath);

            $templateProcessor->setValue('name', strtoupper($document_request['document_details']['name']));
            $templateProcessor->setValue('sitio', $document_request['document_details']['sitio']);
            $templateProcessor->setValue('civil_status', strtolower($document_request['document_details']['civil_status']));
            $templateProcessor->setValue('purpose', strtoupper($document_request['document_details']['purpose']));
            $templateProcessor->setValue('date', date('jS \d\a\y \o\f F Y', strtotime($document_request['created_at'])));
        }

        $fileName = str_replace(' ', '_',strtolower($document_request['document_details']['name'])) . '.docx';
        $savePath = storage_path('app/' . $fileName);
        $templateProcessor->saveAs($savePath);

        return response()->download($savePath)->deleteFileAfterSend(true);
    });
}); 