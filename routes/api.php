<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VerifyUserController;
use App\Http\Controllers\PollingController;


// serve the ids
Route::get('/getId/{user}/front', [VerifyUserController::class, 'serveFrontId']);
Route::get('/getId/{user}/back', [VerifyUserController::class, 'serveBackId']);



Route::get('/poll/unverified-accounts', [PollingController::class, 'getUnverifiedAccounts']);