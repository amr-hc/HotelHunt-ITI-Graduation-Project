<?php

namespace App\Http\Controllers\api;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Http\Controllers\Controller;


class SocialiteController extends Controller
{
    public function redirectToGoogle(){
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function loginGoogle(){
        
        $user = Socialite::driver('google')->stateless()->user();

        $user = User::where('email', $user->email)->first();

        if (!$user ) {
        return response()->json(['message' => 'Email not Signup yet'], 404);
        }
        return ["user" => $user,"token" => $user->createToken('google')->plainTextToken];
    }




}
