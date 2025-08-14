<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\DocumentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class IdController extends Controller
{
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

    public function serveOtherFrontId(DocumentRequest $document_request) {
        $document_request->load('user');


        $dir = storage_path('app/private/ids/'. $document_request->user->email . '/' . $document_request->name . '/');

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

    public function serveOtherBackId(DocumentRequest $document_request) {
        $document_request->load('user');


        $dir = storage_path('app/private/ids/'. $document_request->user->email . '/' . $document_request->name . '/');

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
