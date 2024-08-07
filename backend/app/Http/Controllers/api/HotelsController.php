<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HotelResource;
use Illuminate\Validation\Rule;
use App\Models\Hotel;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Requests\StoreHotelRequest;
use Illuminate\Support\Facades\Log;

class HotelsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hotels = Hotel::orderBy('created_at', 'desc')->get();
        return HotelResource::collection($hotels);
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
    public function store(StoreHotelRequest $request)
    {
        if ($request->hasFile('image')) {
            $photoPath = $request->file('image')->store('hotels');
            $request->merge(['photo' => $photoPath]);
        }
        Hotel::create($request->all());
        return response()->json(['message' => 'Hotel created successfully'], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return new HotelResource(Hotel::findOrFail($id));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hotel $hotel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $hotel = Hotel::findOrFail($id);
        $this->authorize('update', $hotel);

        if ($request->hasFile('image')) {
            $photoPath = $request->file('image')->store('hotels');
            $request->merge(['photo' => $photoPath]);
            if ($hotel->photo!= 'hotels/default.jpg') {
                try {
                    unlink(storage_path('app/public/'. $hotel->photo));
                } catch (\Exception $e) {
                    Log::error('Failed to delete old photo: ' . $e->getMessage());
                }
            }
        }

        $request->validate([
            'name' => [
                'string',
                'min:3',
                'max:100',
                Rule::unique('hotels')->ignore($hotel->id),
            ],
        ], [
            'name.string' => 'The hotel name must be a string.',
            'name.min' => 'The hotel name must be at least :min characters.',
            'name.max' => 'The hotel name may not be greater than :max characters.',
            'name.unique' => 'The hotel name has already been taken.',
        ]);

        $hotel->update($request->all());

        return response()->json(['message' => 'Hotel updated successfully'], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->authorize('isAdmin');

        $bookingIds = DB::table('hotels')
            ->join('roomtypes', 'roomtypes.hotel_id', '=', 'hotels.id')
            ->join('book_details', 'book_details.roomtype_id', '=', 'roomtypes.id')
            ->join('booking', 'booking.id', '=', 'book_details.book_id')
            ->where('hotels.id', $id)
            ->pluck('booking.id');
            

        DB::table('booking')
            ->whereIn('id', $bookingIds)
            ->delete();

        Hotel::destroy($id);

        return response()->json(['message' => 'Hotel deleted successfully'], 200);
    }

    public function getHotelForOwner($ownerId)
    {
        $hotels = Hotel::where('owner_id', $ownerId)->get();

        if ($hotels->isEmpty()) {
            return response()->json(['message' => 'No hotels found for this owner'], 404);
        }

        return HotelResource::collection($hotels);
    }
}
