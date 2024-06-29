<?php

use App\Http\Controllers\api\HotelImagesController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\api\SocialiteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\api\usersController;

use App\Http\Controllers\api\AvailabilityController;
use App\Http\Controllers\api\HotelsController;
use App\Http\Controllers\api\RoomtypesController;
use App\Http\Controllers\api\RateController;
use App\Http\Controllers\api\BookDetailsController;
use App\Http\Controllers\api\BookingController;
use App\Http\Controllers\api\PaymentController;
use App\Http\Controllers\api\CommentController;
use App\Http\Controllers\Api\ContactController;



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
        // 'device_name' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Invalid Email Or Password'],
        ]);
    }
    // return ["user" => $user, "token" => $user->createToken($request->device_name)->plainTextToken];
    return ["user" => $user,"token" => $user->createToken('')->plainTextToken];
});


Route::resource('users', usersController::class);
// ->middleware('auth:sanctum');


Route::resource('hotels', HotelsController::class);
Route::get('owner/{id}/hotels', [HotelsController::class, 'getHotelForOwner']);
Route::get('roomtype/owner', [RoomtypesController::class, 'owner']);
Route::resource('roomtype', RoomtypesController::class);
Route::resource('availability', AvailabilityController::class);
Route::get('availability/room/{room}', [AvailabilityController::class, 'specificRoom']);
Route::resource('bookdetails',BookDetailsController::class);
Route::apiResource('comments', CommentController::class);
Route::get("comments/hotel/{hotelId}",[CommentController::class,'getCommentsByHotelId']);



Route::post('/search', [SearchController::class, 'searchBetweenDates']);
Route::post('/search/hotel', [SearchController::class, 'searchInHotel']);
Route::post('/search/country', [SearchController::class, 'searchByCountry']);
Route::post('/search/city', [SearchController::class, 'searchByCity']);
Route::get('countries', [SearchController::class, 'getAllCountries']);
Route::get('cities/countries', [SearchController::class, 'getCitiesWithCountries']);
Route::get('cities', [SearchController::class, 'getAllCities']);

Route::resource('payments', PaymentController::class);
Route::resource('booking', BookingController::class);
Route::put('booking/{id}/status',[BookingController::class , 'updateStatus']);
Route::get('booking/user-bookings/{user_id}',[BookingController::class,'getUserBookings']);
Route::get('/booking/hotel/{hotel_id}', [BookingController::class, 'getHotelBookings']);
Route::get('/booking/owner/{owner_id}', [BookingController::class, 'getOwnerHotelBookings']);
Route::get('payment/hotel',[PaymentController::class, 'getHotelPayments']);



Route::prefix('hotels')->group(function () {
    Route::get('{hotel}/images', [HotelImagesController::class, 'index']); // List images
    Route::post('{hotel}/images', [HotelImagesController::class, 'store']); // Add image
    Route::get('images/{image}', [HotelImagesController::class, 'show']); // Show a single image
    Route::put('images/{image}', [HotelImagesController::class, 'update']); // Update image
    Route::delete('images/{image}', [HotelImagesController::class, 'destroy']); // Delete image
});



Route::get('/getownerswithouthotel',[usersController::class, 'showOwnersDoesntHave']);

Route::post('/forgot',[usersController::class, 'forgotPassword'] )->middleware('guest')->name('password.email');


Route::post('/reset-password',[usersController::class, 'passwordUpdate'] )->middleware('guest')->name('password.update');


Route::get('/verify/{id}/{hash}', [usersController::class, 'emailConfirmVerification'])->middleware(['auth'])->name('verification.verify');


Route::post('/re-verify', [usersController::class, 'sendEmailVerification'])->middleware(['auth', 'throttle:6,1'])->name('verification.send');



Route::get('/auth/google', [SocialiteController::class, 'redirectToGoogle']);

Route::get('/auth/google/callback', [SocialiteController::class, 'loginGoogle']);


Route::post('rates/create/hotel',[RateController::class,'updateRate']);
Route::GET('rates/user/{user}',[RateController::class,'RateByUser']);
Route::GET('rates/hotel/{hotel}',[RateController::class,'RateByHotel']);
Route::GET('rates/hotel/mine/{hotel}',[RateController::class,'RateByHotelforlogin']);
Route::GET('rates/{hotel}/{user}',[RateController::class,'RateByUserHotel']);
Route::resource('rates', RateController::class);


Route::apiResource('contacts', ContactController::class);

Route::get('create-payment', [PaymentController::class, 'createPayment'])->name('paypal.create');
Route::get('success-payment', [PaymentController::class, 'successPayment'])->name('paypal.success');
Route::get('cancel-payment', [PaymentController::class, 'cancelPayment'])->name('paypal.cancel');
