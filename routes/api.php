<?php 

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\VerifyUserController;
use App\Http\Controllers\PollingController;

use App\Models\User;
use App\Models\DocumentRequest;


Route::middleware(['auth', 'verified'])->group(function () {
    // serve the ids
    Route::get('/getId/{user}/front', [VerifyUserController::class, 'serveFrontId']);
    Route::get('/getId/{user}/back', [VerifyUserController::class, 'serveBackId']);


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