<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\VerifyUserController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DocumentRequestController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\PenaltyController;

use App\Models\DocumentRequest;
use App\Models\User;
use App\Mail\TestMail;


// no gate
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// admin only
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/verify-accounts', [VerifyUserController::class, 'index']);
    Route::get('/document-requests', [DocumentRequestController::class, 'index']);
    Route::get('/logs', [ActivityLogController::class, 'index']);
    Route::get('/users', [UserController::class, 'index']);

    Route::patch('/document-requests/{document_request}', [DocumentRequestController::class, 'update']);

    Route::get('/verify-accounts/{user}', [VerifyUserController::class, 'show']);
    Route::patch('/verify-accounts/{user}', [VerifyUserController::class, 'patch']);
    Route::delete('/verify-accounts/{user}', [VerifyUserController::class, 'destroy']);

    Route::post('/penalties', [PenaltyController::class, 'store']);
});

// authenticated
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {

        $is_admin = Auth::user()->is_admin;

        if ($is_admin) {
            return Inertia::render('dashboard', [
                "totalRequests" => DocumentRequest::all()->count(),
                "totalVerifications" => User::where('verified_at', null)->where('is_admin', 0)->count(),
                "pendingRequests" => DocumentRequest::whereIn('status', ['Pending', 'Under Review'])->count(),
                'approvedToday' => DocumentRequest::where('status', 'Approved')->whereDate('updated_at', today())->count(),
                'declinedToday' => DocumentRequest::where('status', 'Declined')->whereDate('updated_at', today())->count(),
            ]);
        }

        return Inertia::render('dashboard', [
            "totalRequests" => DocumentRequest::where('user_id', Auth::user()->id)->count(),
            "completedRequests" => DocumentRequest::where('user_id', Auth::user()->id)->where('status', 'Completed')->count(),
            "pendingRequests" => DocumentRequest::where('user_id', Auth::user()->id)->whereIn('status', ['Pending', 'Under Review'])->count(),
        ]);
        
    })->name('dashboard');

    Route::get('/request-document', [DocumentRequestController::class, 'create']);
    Route::post('/document-requests', [DocumentRequestController::class, 'store']);
    Route::get('/document-requests/{document_request}', [DocumentRequestController::class, 'show'])
        ->can('view', 'document_request');

    Route::get('/users/{user}', [UserController::class, 'show'])
        ->can('show', 'user');
    Route::get('/my-requests', [UserController::class, 'requests']);
});




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php'; 