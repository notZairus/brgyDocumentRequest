<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Document;


class DocumentController extends Controller
{
    public function index() {
        return Inertia::render('settings/documents/index', [
            'available_documents' => Document::all(),
        ]);
    }

    public function show(Document $document) {
        return Inertia::render('settings/documents/show', [
            'document' => $document,
        ]);
    }

    public function post_receiver(Request $request) {
        if ($request->get('method') === 'put') {
            return $this->put($request);
        }

    }

    public function put(Request $request) {
        $document = Document::find($request->get('id'));
        $document->type = $request->get('type');
        $document->description = $request->get('description');
        $document->price = $request->get('price');
        $document->information = $request->get('information');

        //upload template
        if (!$request->hasFile('template')) {
            return redirect()->back()->with('error', 'No template file uploaded.');
        }

        $file = $request->file('template');
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $path = $request->file('template')->storeAs('templates', $filename, 'templates');

        $document->path = 'app/' . $path;
        $document->save();

        return redirect()->back()->with('success', 'Document updated successfully.');
    }

}
