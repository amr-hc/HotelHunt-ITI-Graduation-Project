<?php

namespace App\Http\Controllers\api;

use App\Http\Resources\UserResource;
use App\Models\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Hash;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class usersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UserResource::collection(User::paginate(10));
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
        $validatedData = $request->validated();

        if ($request->hasFile('photo')) {
            $validatedData['photo'] = $request->file('photo')->store('users');
            if ($user->photo!= 'users/default.jpg') {
                unlink(storage_path('app/public/'. $user->photo));
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
        //
    }
}
