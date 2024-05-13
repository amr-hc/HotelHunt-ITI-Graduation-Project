<?php

namespace App\Http\Controllers;
use App\Models\Roomtype;

use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function searchBetweenDates(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'city' => 'required|string',
        ]);

        $city = $request->city;
        $start_date = $request->start_date;
        $end_date = $request->end_date;



        $availableRoom = RoomType::select('roomtypes.id','roomtypes.name','roomtypes.price', 'roomtypes.hotel_id')
        ->join('availabilities', 'roomtypes.id', '=', 'availabilities.room_type_id')
        ->join('hotels', 'roomtypes.hotel_id', '=', 'hotels.id')
        ->where('availabilities.stock', '>', 0)
        ->whereBetween('availabilities.date', [$start_date, $end_date])
        ->where('hotels.city', $city)
        ->groupBy('roomtypes.id', 'roomtypes.hotel_id','roomtypes.name','roomtypes.price')
        ->havingRaw('COUNT(*) > DATEDIFF(?, ?)', [$end_date, $start_date])
        ->orderBy('roomtypes.hotel_id')
        ->orderBy('roomtypes.price')
        ->take(10)
        ->offset(0)
        ->get();

        return $availableRoom;

        // return AvailabilityResource::collection($availableRoom);

    }


    public function searchInHotel(Request $request){
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'hotel_id' => 'required|integer'
        ]);

        $start_date = $request->start_date;
        $end_date = $request->end_date;
        $hotel_id = $request->hotel_id;

        $availableRoom = RoomType::select('roomtypes.id', 'roomtypes.name', 'roomtypes.price')
        ->selectRaw('MIN(availabilities.stock) AS stock')
        ->join('availabilities', 'roomtypes.id', '=', 'availabilities.room_type_id')
        ->join('hotels', 'roomtypes.hotel_id', '=', 'hotels.id')
        ->where('availabilities.stock', '>', 0)
        ->whereBetween('availabilities.date', [$start_date, $end_date])
        ->where('hotels.id', $hotel_id)
        ->groupBy('roomtypes.id','roomtypes.name', 'roomtypes.price')
        ->havingRaw('COUNT(*) > DATEDIFF(?, ?)', [$end_date, $start_date])
        ->orderBy('roomtypes.price')
        ->limit(10)
        ->offset(0)
        ->get();
        
        return $availableRoom;
    }

    

}
