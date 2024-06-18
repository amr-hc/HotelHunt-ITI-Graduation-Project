<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;

use App\Models\Roomtype;
use Illuminate\Http\Request;

class RoomtypesController extends Controller
{
    // Display a listing of the roomtypes.
    public function index()
    {
        return Roomtype::all();
    }

    // Store a newly created roomtype in storage.
    public function store(Request $request)
    {
        $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'capacity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        $roomtype = Roomtype::create($request->all());
        return response()->json($roomtype, 201);
    }

    // Display the specified roomtype.
    public function show($id)
    {
        return Roomtype::findOrFail($id);
    }

    // Update the specified roomtype in storage.
    public function update(Request $request, $id)
    {
        $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'capacity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        $roomtype = Roomtype::findOrFail($id);
        $roomtype->update($request->all());
        return response()->json($roomtype);
    }

    // Remove the specified roomtype from storage.
    public function destroy($id)
    {
        $roomtype = Roomtype::findOrFail($id);
        $roomtype->delete();
        return response()->json(null, 204);
    }
}
