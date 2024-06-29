<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;

use App\Models\Roomtype;
use App\Models\Hotel;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;


class RoomtypesController extends Controller
{
    public function index()
    {
        return Roomtype::all();
    }
    public function owner()
    {
        $roomtypes = auth()->user()->hotels->roomtypes;
        return $roomtypes;
    }

    public function store(Request $request)
    {
        try{
            $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'capacity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validatedData['photo'] = $request->file('photo')->store('roomtypes');
        } else {
            $validatedData['photo'] = 'roomtypes/default.jpg';
        }

        $validatedData['hotel_id'] = auth()->user()->hotels->id;

        $roomtype = Roomtype::create($validatedData);

        return response()->json($roomtype, 201);
        }catch (Exception $e){
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        return Roomtype::findOrFail($id);
    }

    public function showHotel($id)
    {
        return Hotel::findOrFail($id)->roomtypes;
    }

    public function update(Request $request, $id)
{
    $roomtype = Roomtype::findOrFail($id);

    try{
        $validatedData = $request->validate([
        'name' => 'nullable|string|max:255',
        'description' => 'nullable|string',
        'capacity' => 'nullable|integer|min:1',
        'price' => 'nullable|numeric|min:0',
        'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    if ($request->hasFile('photo')) {
        if ($roomtype->photo && $roomtype->photo != 'roomtypes/default.jpg') {
            try {
                Storage::delete($roomtype->photo);
            } catch (\Exception $e) {
                Log::error('Failed to delete old photo: ' . $e->getMessage());
            }
        }
        $validatedData['photo'] = $request->file('photo')->store('roomtypes');
    }

    $roomtype->update($validatedData);

    return response()->json($roomtype, 200);
    }catch (Exception $e){
        return response()->json(['message' => $e->getMessage()], 500);
    }
}

    public function destroy($id)
    {
        $roomtype = Roomtype::findOrFail($id);
        $roomtype->delete();
        return response()->json(null, 204);
    }
}
