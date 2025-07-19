<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PollingController extends Controller
{
    public function getUnverifiedAccounts() {
        $unverified_users = User::where('verified_at', null)
            ->where('is_admin', 0)
            ->latest()
            ->paginate(5);

        return response()->json([
            'unverifiedUsers' => $unverified_users
        ]);
    }
}
