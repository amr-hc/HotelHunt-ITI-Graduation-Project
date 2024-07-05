<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\BookDetail;
use App\Models\Booking;
use App\Models\Hotel;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Notifications\BookingCreated;
use App\Notifications\BookingCancelled;


class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $bookings = Booking::with('book_details.roomType.hotel')->get();
    return BookingResource::collection($bookings);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'duration' => 'required|numeric',
            'status' => 'required|in:completed,progress,cancel',
            'books_details' => 'required|array',
            'books_details.*.roomType_id' => 'required|exists:roomtypes,id',
            'books_details.*.date' => 'required|date',
            'books_details.*.price' => 'required|numeric',
            'check_in' => 'required|date',
            'check_out' => 'required|date',

        ]);

        DB::beginTransaction();

        try {
            $booking = Booking::create($request->only(['user_id', 'duration', 'status','check_in','check_out']));

            foreach ($request->books_details as $detail) {
                BookDetail::create([
                    'roomType_id' => $detail['roomType_id'],
                    'book_id' => $booking->id,
                    'date' => $detail['date'],
                    'price' => $detail['price'],
                ]);
            }

            DB::commit();

            $booking->user->notify(new BookingCreated($booking));
            return response()->json($booking->load('book_details'), 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create booking: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
{
    $booking = Booking::with('book_details.roomType.hotel')->findOrFail($id);
    return new BookingResource($booking);
}

    /**
     * Update the specified resource in storage.
     */
     public function update(Request $request, string $id)
{
    // Outer try-catch block
    try {
        $booking = Booking::findOrFail($id);

        // Validate the request
        $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'duration' => 'sometimes|required|numeric',
            'status' => 'sometimes|required|in:completed,progress,cancel',
            'book_details' => 'sometimes|required|array',
            'book_details.*.id' => 'sometimes|exists:book_details,id',
            'book_details.*.roomType_id' => 'sometimes|required|exists:roomtypes,id',
            'book_details.*.date' => 'sometimes|required|date',
            'book_details.*.price' => 'sometimes|required|numeric',
            'check_in' => 'sometimes|required|date',
            'check_out' => 'sometimes|required|date',
        ]);

        DB::beginTransaction();

        try {

            $booking->update($request->only(['user_id', 'duration', 'status','check_in','check_out']));

            if ($request->has('book_details')) {
                foreach ($request->book_details as $detail) {
                    if (isset($detail['id'])) {
                        $bookDetail = BookDetail::findOrFail($detail['id']);
                        $bookDetail->update($detail);
                    } else {
                        BookDetail::create([
                            'roomType_id' => $detail['roomType_id'],
                            'book_id' => $booking->id,
                            'date' => $detail['date'],
                            'price' => $detail['price'],
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json($booking->load('book_details'), 200);
        } catch (Exception $innerException) {
            DB::rollBack();
            Log::error('Failed to update booking details: ' . $innerException->getMessage());
            return response()->json(['error' => 'Failed to update booking details: ' . $innerException->getMessage()], 500);
        }

    } catch (ValidationException $validationException) {
        return response()->json(['error' => $validationException->errors()], 422);
    } catch (Exception $outerException) {
        Log::error('Failed to update booking: ' . $outerException->getMessage());
        return response()->json(['error' => 'Failed to update booking: ' . $outerException->getMessage()], 500);
    }
}

    public function updateStatus(Request $request, string $id)
    {
        try {
            // Validate the request data
            $validatedData = $request->validate([
                'status' => 'string|in:progress,cancel,completed'
            ]);

            $booking = Booking::findOrFail($id);

            $booking->status = $validatedData['status'];
            $booking->save();

            if($booking->status == 'cancel'){
                $booking->user->notify(new BookingCancelled($booking));
            }

            return response()->json([
                'message' => 'Booking status updated successfully.',
                'booking' => $booking
            ], 200);

        } catch (Exception $e) {
            // Return a user-friendly error message
            return response()->json([
                'error' => 'Error updating booking status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    // public function destroy(string $id)
    // {
    //     $booking = Booking::findOrFail($id);
    //     $booking->delete();
    //     return response()->json(null, 204);
    // }
    public function destroy(string $id)
    {
        try {
            $booking = Booking::findOrFail($id);

            if ($booking->status === 'completed') {
                return response()->json(['error' => 'Booking with status "completed" cannot be canceled.'], 403);
            }

            $booking->status = 'cancel';
            $booking->save();

            return response()->json(['message' => 'Booking status updated to "cancel".'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to update booking status: ' . $e->getMessage()], 500);
        }
    }



    public function getUserBookings($user_id)
{
    try {
        $bookings = Booking::where('user_id', $user_id)->with('book_details.roomType.hotel')->get();

        if ($bookings->isEmpty()) {
            return response()->json(['message' => 'No bookings found for this user.'], 404);
        }
        return BookingResource::collection($bookings);
    } catch (Exception $e) {
        Log::error('Failed to fetch user bookings: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to fetch user bookings.'], 500);
    }
}

public function getHotelBookings($hotel_id)
{
    try {
        $bookings = Booking::whereHas('book_details.roomType.hotel', function ($query) use ($hotel_id) {
            $query->where('id', $hotel_id);
        })->with('book_details.roomType.hotel')->get();

        if ($bookings->isEmpty()) {
            return response()->json(['message' => 'No bookings found for this hotel.'], 404);
        }

        return BookingResource::collection($bookings);
    } catch (Exception $e) {
        Log::error('Failed to fetch hotel bookings: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to fetch hotel bookings.'], 500);
    }
}

public function getOwnerHotelBookings($owner_id)
{
    try {
        // Fetch all hotel IDs for the given owner_id
        $hotelIds = Hotel::where('owner_id', $owner_id)->pluck('id');

        // Fetch bookings for the hotels owned by the owner
        $bookings = Booking::whereHas('book_details.roomType.hotel', function ($query) use ($hotelIds) {
            $query->whereIn('id', $hotelIds);
        })->with('book_details.roomType.hotel')->get();

        if ($bookings->isEmpty()) {
            return response()->json(['message' => 'No bookings found for hotels owned by this owner.'], 404);
        }

        return BookingResource::collection($bookings);
    } catch (Exception $e) {
        Log::error('Failed to fetch bookings for owner\'s hotels: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to fetch bookings for owner\'s hotels.'], 500);
    }
}


public function cancel(string $id) {
    try {
        $booking = Booking::findOrFail($id);

        if ($booking->status === 'completed' || $booking->status === 'cancel') {
            return response()->json(['error' => 'Booking with status completed or cancel cannot be canceled.'], 403);
        }

        $booking->status = 'cancel';
        $booking->save();

        return response()->json(['message' => 'Booking status updated to cancel.'], 200);
    } catch (Exception $e) {
        return response()->json(['error' => 'Failed to update booking status: '. $e->getMessage()], 500);
    }
}


}
