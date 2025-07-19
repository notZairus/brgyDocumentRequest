<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\VerifyUserController;
use App\Http\Controllers\UserController;




Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});



Route::get('/verify-accounts', [VerifyUserController::class, 'index']);
Route::get('/verify-accounts/{user}', [VerifyUserController::class, 'show']);
Route::patch('/verify-accounts/{user}', [VerifyUserController::class, 'patch']);
Route::delete('/verify-accounts/{user}', [VerifyUserController::class, 'destroy']);

Route::get('/getId/{user}/front', [VerifyUserController::class, 'serveFrontId']);
Route::get('/getId/{user}/back', [VerifyUserController::class, 'serveBackId']);



Route::get('/users', [UserController::class, 'index']);




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';