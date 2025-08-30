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

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/download-docx/{document_request}', function(DocumentRequest $document_request) {
        // $templatePath = storage_path('app/templates/template.docx');

        // $templateProcessor = new TemplateProcessor($templatePath);
        // $templateProcessor->setValue('zname', $document_request->name);

        // $fileName = $document_request->name . '.docx';
        // $savePath = storage_path('app/' . $fileName);
        // $templateProcessor->saveAs($savePath);

        // return response()->download($savePath)->deleteFileAfterSend(true);
    });
}); 