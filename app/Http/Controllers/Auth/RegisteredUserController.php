<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validatedAttributes = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'sitio' => 'required|string|max:255',
            'number' => 'required|string|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'brgyIdFront' => ['required'],
            'brgyIdBack' => ['required'],
            'selfie' => ['required'],
        ]);
        
        $extension = $request->file('brgyIdFront')['file']->getClientOriginalExtension();

        $request->file('brgyIdFront')['file']->storeAs(
            'ids/'. $validatedAttributes['email'], 
            'front.' . $extension,
        );

        $request->file('brgyIdBack')['file']->storeAs(
            'ids/' . $validatedAttributes['email'],
            'back.' . $extension,
        );

        $request->file('selfie')['file']->storeAs(
            'ids/' . $validatedAttributes['email'],
            'selfie.' . $extension,
        );

        $user = User::create([
            'name' => $request->middle_initial 
                ? $request->first_name . ' ' . $request->middle_initial . '. ' . $request->last_name 
                : $request->first_name . ' ' . $request->last_name,
                
            'email' => $request->email,
            'number' => $request->number,
            'sitio' => $request->sitio,
            'password' => Hash::make($request->password),
            'isAdmin' => false
        ]);

        event(new Registered($user));

        return redirect('login');
    }
}
