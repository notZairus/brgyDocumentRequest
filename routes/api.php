<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PollingController;


Route::get('/poll/unverified-accounts', [PollingController::class, 'getUnverifiedAccounts']);