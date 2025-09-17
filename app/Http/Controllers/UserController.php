<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\DocumentRequest;


class UserController extends Controller
{
    public function index(Request $request)
    {
        $registered_users = User::whereNotNull('verified_at')
            ->where('is_admin', 0)
            ->with('penalties')
            ->get();

        return Inertia::render('users/index', [
            'registeredUsers' => $registered_users
        ]);

        
    }

    public function show(User $user) {
        $user->load('penalties');
        return Inertia::render('users/show', [
            'user' => $user,
        ]);
    }

    public function requests() {
        $allDR = DocumentRequest::where('user_id', Auth::user()->id)->get();

        return Inertia::render('users/requests/index', [
            'documentRequests' => $allDR
        ]);
    }
}
