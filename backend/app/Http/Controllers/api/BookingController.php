<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\BookDetail;
use App\Models\Booking;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

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
        // Validate the request
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'duration' => 'required|numeric',
            'status' => 'required|in:completed,progress,cancel',
            'books_details' => 'required|array',
            'books_details.*.roomType_id' => 'required|exists:roomtypes,id',
            'books_details.*.date' => 'required|date',
            'books_details.*.price' => 'required|numeric',
        ]);

        DB::beginTransaction();

        try {
            $booking = Booking::create($request->only(['user_id', 'duration', 'status']));

            foreach ($request->books_details as $detail) {
                BookDetail::create([
                    'roomType_id' => $detail['roomType_id'],
                    'book_id' => $booking->id,
                    'date' => $detail['date'],
                    'price' => $detail['price'],
                ]);
            }

            DB::commit();
            return response()->json($booking->load('book_details'), 201);
        } catch (\Exception $e) {
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
        ]);

        DB::beginTransaction();

        try {

            $booking->update($request->only(['user_id', 'duration', 'status']));

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
        } catch (\Exception $innerException) {
            DB::rollBack();
            Log::error('Failed to update booking details: ' . $innerException->getMessage());
            return response()->json(['error' => 'Failed to update booking details: ' . $innerException->getMessage()], 500);
        }

    } catch (ValidationException $validationException) {
        return response()->json(['error' => $validationException->errors()], 422);
    } catch (\Exception $outerException) {
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

            // Find the booking by ID
            $booking = Booking::findOrFail($id);

            // Update the status
            $booking->status = $validatedData['status'];
            $booking->save();

            // Return a successful response
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
    public function destroy(string $id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();
        return response()->json(null, 204);
    }
}
