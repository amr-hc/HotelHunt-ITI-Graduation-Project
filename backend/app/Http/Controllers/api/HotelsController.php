<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HotelResource;
use Illuminate\Validation\Rule; 
use App\Models\Hotel;
use Illuminate\Http\Request;
use App\Http\Requests\StoreHotelRequest;

class HotelsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hotels=Hotel::all();
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

        if ($request->hasFile('image')) {
            $photoPath = $request->file('image')->store('hotels');
            $request->merge(['photo' => $photoPath]);
            if ($hotel->photo!= 'hotels/default.jpg') {
                // unlink(storage_path('app/public/'. $hotel->photo));
            }
        }

        $request->validate([
            'name' => [
                'required',
                'string',
                'min:3',
                'max:100',
                Rule::unique('hotels')->ignore($hotel->id),
            ],
        ], [
            'name.required' => 'The hotel name is required.',
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
        Hotel::destroy($id);
        return response()->json(['message' => 'Hotel deleted successfully'], 200);
    }

    public function getHotelForOwner($ownerId)
    {
        $hotels = Hotel::where('owner_id', $ownerId)->get();

        // Check if any hotels are found
        if ($hotels->isEmpty()) {
            return response()->json(['message' => 'No hotels found for this owner'], 404);
        }

        // Return the hotels data
        return HotelResource::collection($hotels);
    }
}
