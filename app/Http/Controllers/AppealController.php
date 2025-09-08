<?php

namespace App\Http\Controllers;

use App\Models\Appeal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AppealController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('appeals/index', [
            'appeals' => Appeal::with('penalty')
                                ->with('user')
                                ->where('status', 'Pending')
                                ->paginate(5)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'penalty_id' => 'required|exists:penalties,id',
            'reason' => 'required|string|max:1000|min:10',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('error', 'There was an error with your submission. Please ensure all fields are filled out correctly.');
        }

        if ($request->user()->appeals()->where('penalty_id', $request->penalty_id)->exists()) {
            return redirect()->back()->with('error', 'You have already submitted an appeal for this penalty.');
        }

        Appeal::create([
            'user_id' => $request->user()->id,
            ...$request->all()
        ]);
        
        return redirect()->back()->with('success', 'Your appeal has been submitted successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Appeal $appeal)
    {
        $appeal->load('penalty', 'user');
        
        return Inertia::render('appeals/show', [
            'appeal' => $appeal
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Appeal $appeal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Appeal $appeal)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appeal $appeal)
    {
        //
    }
}
