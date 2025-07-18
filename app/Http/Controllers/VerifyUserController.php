<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;


class VerifyUserController extends Controller
{
    public function index() {
        $unverified_users = User::where('verified_at', null)
            ->where('is_admin', 0)
            ->latest()
            ->paginate(5);
            

        return Inertia::render('verify-user/index', [
            "unverifiedUsers" => $unverified_users
        ]);
    }


    public function show(User $user) {
        if (!file_exists(storage_path('app/private/ids/'. $user->email . '/'))) {
            abort(404);
        }

        return Inertia::render('verify-user/show', [
            "user" => $user,
        ]);
    }

    public function patch(User $user) {
        $user->update([
            'verified_at' => now(),
        ]);

        return redirect('/verify-accounts');
    }



    public function destroy(User $user) {
        Storage::disk('local')->deleteDirectory('ids/' . $user->email);
        $user->delete();

        return redirect('/verify-accounts');
    }





















    public function serveFrontId(User $user) {
        if (!file_exists(storage_path('app/private/ids/'. $user->email . '/'))) {
            abort(404);
        }

        return response()->file(storage_path('app/private/ids/'. $user->email . '/front.jpg'));
    }

    public function serveBackId(User $user) {
        if (!file_exists(storage_path('app/private/ids/'. $user->email . '/'))) {
            abort(404);
        }
        
        return response()->file(storage_path('app/private/ids/'. $user->email . '/back.jpg'));
    }
}


