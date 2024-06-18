<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\HotelImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HotelImagesController extends Controller
{
    public function index(Hotel $hotel){
        $images = $hotel->images()->get();
        return response()->json($images,200);
    }
    public function store(Request $request, Hotel $hotel){
        $validator = Validator::make($request->all(), [
            'image' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $image = new HotelImage();
        $image->hotel_id = $hotel->id;
        $image->image = $request->image;
        $image->save();

        return response()->json($image, 201);
    }

    public function show(HotelImage $image)
    {
        return response()->json($image, 200);
    }

    public function update(Request $request, HotelImage $image)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $image->update($request->all());

        return response()->json($image, 200);
    }
    public function destroy(HotelImage $image)
    {
        $image->delete();
        return response()->json(['message' => 'Image deleted successfully'], 200);
    }
}
