<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function searchBetweenDates(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'city' => 'required|string',
            'hotel_id' => 'integer'
        ]);

        $city = $request->city;
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        // $query = "
        // SELECT roomtypes.id , roomtypes.hotel_id
        // FROM availabilities
        // INNER JOIN roomtypes ON roomtypes.id = availabilities.room_type_id
        // INNER JOIN hotels ON roomtypes.hotel_id = hotels.id
        // WHERE availabilities.stock > 0 AND availabilities.date BETWEEN '$start_date' AND '$end_date' AND hotels.city='$city'
        // GROUP by roomtypes.id ,roomtypes.hotel_id
        // HAVING COUNT(*) > DATEDIFF('$end_date', '$start_date')
        // ORDER BY roomtypes.hotel_id, roomtypes.price        
        // limit 10 offset 0;        
        // ";
    
    // $availabilities = DB::select($query);
        // return $availabilities;

        if (!isset($request->hotel_id)) {
        $availabilities = RoomType::select('roomtypes.id','roomtypes.name','roomtypes.price', 'roomtypes.hotel_id')
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
        }else{

        $hotel_id = $request->hotel_id;
        $availabilities = RoomType::select('roomtypes.id', 'roomtypes.name', 'roomtypes.price')
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
    
        }
        return $availabilities;

        // return AvailabilityResource::collection($availabilities);

        // Return the response
        // return $availabilities;
    }
}
