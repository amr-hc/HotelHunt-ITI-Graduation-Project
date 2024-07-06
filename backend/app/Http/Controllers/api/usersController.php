<?php

namespace App\Http\Controllers\api;

use App\Http\Resources\UserResource;
use App\Models\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;

use Illuminate\Support\Facades\Hash;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;



class usersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UserResource::collection(User::orderBy('created_at', 'desc')->get());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['password'] = Hash::make($validatedData['password']);

        if ($request->hasFile('photo')) {
            $validatedData['photo'] = $request->file('photo')->store('users');
        }

        if (!isset($validatedData['photo'])) {
            $validatedData['photo'] = 'users/default.jpg';
        }


        $user = User::create($validatedData);

        event(new Registered($user));


        return ["user" => new UserResource($user), "token" => $user->createToken("register")->plainTextToken];
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return new UserResource(User::findOrFail($id));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, string $id)
    {
        $user = User::findOrFail($id);

        $this->authorize('update', $user);

        $validatedData = $request->validated();

        if ($request->hasFile('photo')) {
            $validatedData['photo'] = $request->file('photo')->store('users');
            if ($user->photo && $user->photo!= 'users/default.jpg') {

                try {
                    unlink(storage_path('app/public/'. $user->photo));
                } catch (\Exception $e) {
                    Log::error('Failed to delete old photo: ' . $e->getMessage());
                }

            }
        }

        if(isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }
        $user->update($validatedData);

        return response()->json(['message' => 'User updated successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->authorize('isAdmin');
    
        $user = User::findOrFail($id);
    
        $hotel_id = $user?->hotels?->id;
    
        if ($hotel_id) {
            $bookingIds = DB::table('hotels')
                ->join('roomtypes', 'roomtypes.hotel_id', '=', 'hotels.id')
                ->join('book_details', 'book_details.roomtype_id', '=', 'roomtypes.id')
                ->join('booking', 'booking.id', '=', 'book_details.book_id')
                ->where('hotels.id', $hotel_id)
                ->pluck('booking.id');
    
            DB::table('booking')
                ->whereIn('id', $bookingIds)
                ->delete();
        }
    
        $user->delete();
    
        return response()->json(['message' => 'User deleted successfully'], 200);
    }
    




    public function showOwnersDoesntHave()
    {
        $this->authorize('isAdmin');

        User::where('role', 'owner')->whereDoesntHave('hotels')->get();

        return UserResource::collection( User::where('role', 'owner')->whereDoesntHave('hotels')->get());

    }





    public function forgotPassword (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink(
        $request->only('email')
    );

    return $status === Password::RESET_LINK_SENT
        ? response()->json(['status' => 'Token Sent Completed'], 200)
        : response()->json(['status' => 'Token Reset Failed'], 400);
    }



    public function passwordUpdate(Request $request) {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function (User $user, string $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->setRememberToken(Str::random(60));

            $user->save();

            event(new PasswordReset($user));
        }
    );

    return $status === Password::PASSWORD_RESET
                ? response()->json(['status' => 'password reset completed'], 200)
                : response()->json(['status' => 'password reset Failed'], 400);
    }




    public function emailConfirmVerification(EmailVerificationRequest $request) {
        $request->fulfill();

        return response()->json(['status' => 'Account Activated Successfully'], 200);
    }

    public function sendEmailVerification(Request  $request) {
        $request->user()->sendEmailVerificationNotification();
        return response()->json(['status' => 'Verification link sent'], 200);
    }


}
