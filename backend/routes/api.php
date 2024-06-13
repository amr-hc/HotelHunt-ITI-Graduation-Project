<?php

use App\Http\Controllers\SearchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\api\usersController;

use App\Http\Controllers\api\AvailabilityController;
use App\Http\Controllers\api\HotelsController;
use App\Http\Controllers\api\RoomtypesController;
use App\Http\Controllers\api\RateController;
use App\Http\Controllers\api\BookDetailsController;
use App\Http\Controllers\api\PaymentController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});






use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
 
Route::post('/login', function (Request $request) { 
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'device_name' => 'required',
    ]);
 
    $user = User::where('email', $request->email)->first();
 
    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }
    return ["user" => $user, "token" => $user->createToken($request->device_name)->plainTextToken];
});


Route::resource('users', usersController::class);
// ->middleware('auth:sanctum');


Route::resource('hotels', HotelsController::class);
Route::resource('roomtype', RoomtypesController::class);
Route::resource('availability', AvailabilityController::class);
Route::resource('rates', RateController::class);
Route::resource('bookdetails',BookDetailsController::class);


Route::post('/search', [SearchController::class, 'searchBetweenDates']);
Route::post('/search/hotel', [SearchController::class, 'searchInHotel']);

Route::resource('payments', PaymentController::class);

