<?php

namespace App\Http\Controllers;
use App\Models\Roomtype;

use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function searchBetweenDates(Request $request)
    {
        $request->validate([
            // 'start_date' => 'required|date|after_or_equal:today',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'city' => 'required|string',
        ]);

        $city = $request->city;
        $start_date = $request->start_date;
        $end_date = $request->end_date;



        $availableRooms = RoomType::select('roomtypes.id','roomtypes.name','roomtypes.price', 'roomtypes.hotel_id','hotels.name as hotel_name','hotels.photo','hotels.star_rating')
        ->join('availabilities', 'roomtypes.id', '=', 'availabilities.room_type_id')
        ->join('hotels', 'roomtypes.hotel_id', '=', 'hotels.id')
        ->where('availabilities.stock', '>', 0)
        ->whereBetween('availabilities.date', [$start_date, $end_date])
        ->where('hotels.city', $city)
        ->groupBy('roomtypes.id', 'roomtypes.hotel_id','roomtypes.name','roomtypes.price','hotels.name','hotels.photo')
        ->havingRaw('COUNT(*) > DATEDIFF(?, ?)', [$end_date, $start_date])
        // ->orderBy('roomtypes.hotel_id')
        // ->orderBy('roomtypes.price')
        ->paginate(10);

        if ($request->sort=="price"){
        $availableRooms = RoomType::select('roomtypes.id','roomtypes.name','roomtypes.price', 'roomtypes.hotel_id','hotels.name as hotel_name','hotels.photo','hotels.star_rating')
        ->join('availabilities', 'roomtypes.id', '=', 'availabilities.room_type_id')
        ->join('hotels', 'roomtypes.hotel_id', '=', 'hotels.id')
        ->where('availabilities.stock', '>', 0)
        ->whereBetween('availabilities.date', [$start_date, $end_date])
        ->where('hotels.city', $city)
        ->groupBy('roomtypes.id', 'roomtypes.hotel_id','roomtypes.name','roomtypes.price','hotels.name','hotels.photo')
        ->havingRaw('COUNT(*) > DATEDIFF(?, ?)', [$end_date, $start_date])
        // ->orderBy('roomtypes.hotel_id')
        ->orderBy('roomtypes.price')
        ->paginate(10);
        }

        if ($request->sort=="name"){
        $availableRooms = RoomType::select('roomtypes.id','roomtypes.name','roomtypes.price', 'roomtypes.hotel_id','hotels.name as hotel_name','hotels.photo','hotels.star_rating')
        ->join('availabilities', 'roomtypes.id', '=', 'availabilities.room_type_id')
        ->join('hotels', 'roomtypes.hotel_id', '=', 'hotels.id')
        ->where('availabilities.stock', '>', 0)
        ->whereBetween('availabilities.date', [$start_date, $end_date])
        ->where('hotels.city', $city)
        ->groupBy('roomtypes.id', 'roomtypes.hotel_id','roomtypes.name','roomtypes.price','hotels.name','hotels.photo')
        ->havingRaw('COUNT(*) > DATEDIFF(?, ?)', [$end_date, $start_date])
        // ->orderBy('roomtypes.hotel_id')
        ->orderBy('hotels.name')
        ->paginate(10);
        }
        if ($request->sort=="star_rating"){
        $availableRooms = RoomType::select('roomtypes.id','roomtypes.name','roomtypes.price', 'roomtypes.hotel_id','hotels.name as hotel_name','hotels.photo','hotels.star_rating')
        ->join('availabilities', 'roomtypes.id', '=', 'availabilities.room_type_id')
        ->join('hotels', 'roomtypes.hotel_id', '=', 'hotels.id')
        ->where('availabilities.stock', '>', 0)
        ->whereBetween('availabilities.date', [$start_date, $end_date])
        ->where('hotels.city', $city)
        ->groupBy('roomtypes.id', 'roomtypes.hotel_id','roomtypes.name','roomtypes.price','hotels.name','hotels.photo')
        ->havingRaw('COUNT(*) > DATEDIFF(?, ?)', [$end_date, $start_date])
        // ->orderBy('roomtypes.hotel_id')
        ->orderBy('hotels.star_rating', 'desc')
        ->paginate(10);
        }
        return $availableRooms;

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

        $availableRooms = RoomType::select('roomtypes.id', 'roomtypes.name', 'roomtypes.price','roomtypes.description')
        ->selectRaw('MIN(availabilities.stock) AS stock')
        ->join('availabilities', 'roomtypes.id', '=', 'availabilities.room_type_id')
        ->join('hotels', 'roomtypes.hotel_id', '=', 'hotels.id')
        ->where('availabilities.stock', '>', 0)
        ->whereBetween('availabilities.date', [$start_date, $end_date])
        ->where('hotels.id', $hotel_id)
        ->groupBy('roomtypes.id','roomtypes.name', 'roomtypes.price')
        ->havingRaw('COUNT(*) > DATEDIFF(?, ?)', [$end_date, $start_date])
        ->orderBy('roomtypes.price')->get();
        return $availableRooms;
    }


}
