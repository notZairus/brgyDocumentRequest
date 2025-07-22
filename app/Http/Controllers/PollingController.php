<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\User;
use App\Models\DocumentRequest;


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

    public function getDocumentRequests() {
        $allDR = DocumentRequest::with('user')->get();

        $mapped = collect($allDR)->map(function ($rd) {
            $rd->user_name = $rd->user->name;
            return $rd;
        });

        return response()->json([
            'documentRequests' => $mapped
        ]);
    }
}

