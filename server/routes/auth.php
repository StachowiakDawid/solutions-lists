<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;

Route::get('/auth/redirect', function () {
    return Socialite::driver('google')->stateless()->redirect()->getTargetURL();
})->name('login');

Route::middleware('auth:sanctum')->get('/auth/logout', function (Request $request) {
    $request->user()->tokens()->delete();
    return response('wylogowano', 201);
});

Route::get('/auth/callback', function () {
    try {
        $user = Socialite::driver('google')->stateless()->user();
    } catch (ClientException $exception) {
        return response()->json(['error' => 'Invalid credentials provided.'], 422);
    }
    $userCreated = User::firstOrCreate(
        [
            'email' => $user->getEmail(),
        ],
        [
            'role' => 'user',
        ]
    );
    $token = $userCreated->createToken('myapptoken')->plainTextToken;
    $response = [
        'user' => $user->email,
        'role' => $userCreated->role,
        'token' => $token,
    ];
    return response($response, 201);
});
