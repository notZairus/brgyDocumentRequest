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
        $path = storage_path($document->path);
        $template = null;

        if (file_exists($path) && $document->path) {
            $template = base64_encode(file_get_contents($path));
        }

        return Inertia::render('settings/documents/show', [
            'document' => $document,
            'template' => $template,
        ]);
    }

    public function post_receiver(Request $request) {
        if ($request->get('method') === 'put') return $this->put($request);
        if ($request->get('method') === 'post') return $this->post($request);
    }


    public function post(Request $request) {
        $new_document = Document::create([
            'type' => time(),
            'price' => $request->get('price'),
            'information' => json_encode($request->get('information')),
            'path' => ''
        ]);

        return redirect('/settings/documents/' . $new_document->id)->with('success', 'Document type created successfully!');
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

        $pathOfCurrentTemplate = storage_path($document->path);
        if ($document->path && file_exists($pathOfCurrentTemplate)) {
            unlink($pathOfCurrentTemplate);
        }

        $document->path = 'app/' . $path;
        $document->save();

        return redirect()->back()->with('success', 'Document updated successfully.');
    }
    
    public function delete(Request $request) {
        $document = Document::find($request->document_id);
        $document->delete();
        return redirect('/settings/documents')->with('success', 'Document deleted successfully.');
    }

}
