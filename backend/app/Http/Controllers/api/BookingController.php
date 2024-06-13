<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BookDetail;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $booking = Booking::all();
        return response()->json($booking , 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'total_price' => 'required|numeric',
            'duration' => 'required|numeric',
            'status' => 'required|in:completed,progress,cancel',
            'books_details' => 'required|array',
            'books_details.*.roomType_id' => 'required|exists:roomtypes,id',
            'books_details.*.date' => 'required|date',
            'books_details.*.price' => 'required|numeric',
        ]);

        DB::beginTransaction();

        try {
            $booking = Booking::create($request->only(['user_id', 'total_price', 'duration', 'status']));

            foreach ($request->books_details as $detail) {
                BookDetail::create([
                    'roomType_id' => $detail['roomType_id'],
                    'book_id' => $booking->id,
                    'date' => $detail['date'],
                    'price' => $detail['price'],
                ]);
            }

            DB::commit();
            return response()->json($booking->load('booksDetails'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create booking: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $booking = Booking::findOrFail($id);
        return response()->json($booking, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $booking = Booking::findOrFail($id);

        $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'total_price' => 'sometimes|required|numeric',
            'duration' => 'sometimes|required|numeric',
            'status' => 'sometimes|required|in:completed,progress,cancel',
        ]);

        $booking->update($request->all());
        return response()->json($booking, 200);
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
