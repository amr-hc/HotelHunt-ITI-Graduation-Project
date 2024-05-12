<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HotelResource;
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
    public function update(StoreHotelRequest $request,$id)
    {
        $hotel=Hotel::findOrFail($id);
        $hotel->update($request->all());

        return response()->json(['message' => 'Hotel updated successfully'],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Hotel::destroy($id);
        return response()->json(['message' => 'Hotel deleted successfully'], 200);
    }
}
