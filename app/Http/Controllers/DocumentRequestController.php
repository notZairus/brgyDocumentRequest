<?php

namespace App\Http\Controllers;

use App\Models\DocumentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;



class DocumentRequestController extends Controller
{
    public function create()
    {
        return Inertia::render('document-requests/create');
    }

    public function store(Request $request) {
        dd($request->all());
    }
}
