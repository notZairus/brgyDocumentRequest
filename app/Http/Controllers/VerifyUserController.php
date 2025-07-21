<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
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
            
        return Inertia::render('verify-users/index', ["unverifiedUsers" => $unverified_users]);
    }

    public function show(User $user) {
        if (!file_exists(storage_path('app/private/ids/'. $user->email . '/'))) {
            abort(404);
        }

        return Inertia::render('verify-users/show', ["user" => $user]);
    }

    public function patch(User $user) {
        $user->update([
            'verified_at' => now(),
            'status' => 'active'
        ]);

        return redirect('/verify-accounts');
    }

    public function destroy(User $user) {
        Storage::disk('local')->deleteDirectory('ids/' . $user->email);
        $user->delete();

        return redirect('/verify-accounts');
    }





















    public function serveFrontId(User $user) {
        $dir = storage_path('app/private/ids/'. $user->email . '/');

        if (!file_exists($dir)) {
            abort(404);
        }

        $matching_file = collect(File::files($dir))->first(function ($file) {
            return pathinfo($file, PATHINFO_FILENAME) == "front";
        });

        return response()->file(
            $matching_file->getRealPath()
        );
    }

    public function serveBackId(User $user) {
        $dir = storage_path('app/private/ids/'. $user->email . '/');

        if (!file_exists($dir)) {
            abort(404);
        }

        $matching_file = collect(File::files($dir))->first(function ($file) {
            return pathinfo($file, PATHINFO_FILENAME) == "back";
        });

        return response()->file(
            $matching_file->getRealPath()
        );
    }
}


