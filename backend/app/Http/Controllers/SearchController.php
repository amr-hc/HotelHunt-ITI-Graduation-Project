<?php

namespace App\Http\Controllers;
use App\Models\Roomtype;
use App\Models\Hotel;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;

class SearchController extends Controller
{
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

        $rateSubquery = DB::table('rates')
            ->select('hotel_id', DB::raw('AVG(rate) as average_rate'))
            ->groupBy('hotel_id');

        $availableRoomsQuery = RoomType::select(
            'roomtypes.id',
            'roomtypes.name',
            'roomtypes.price',
            'roomtypes.hotel_id',
            'hotels.name as hotel_name',
            'hotels.photo',
            'hotels.star_rating',
            'rate_averages.average_rate'
        )
        ->join('availabilities', 'roomtypes.id', '=', 'availabilities.room_type_id')
        ->join('hotels', 'roomtypes.hotel_id', '=', 'hotels.id')
        ->leftJoinSub($rateSubquery, 'rate_averages', function ($join) {
            $join->on('hotels.id', '=', 'rate_averages.hotel_id');
        })
        ->where('availabilities.stock', '>', 0)
        ->whereBetween('availabilities.date', [$start_date, $end_date])
        ->where('hotels.city', $city)
        ->where('hotels.status', 'active')
        ->groupBy(
            'roomtypes.id',
            'roomtypes.name',
            'roomtypes.price',
            'roomtypes.hotel_id',
            'hotels.name',
            'hotels.photo',
            'hotels.star_rating',
            'rate_averages.average_rate'
        )
        ->havingRaw('COUNT(availabilities.date) >= DATEDIFF(?, ?)', [$end_date, $start_date]);

        if ($request->sort == "rate") {
            $availableRoomsQuery->orderBy('rate_averages.average_rate', 'desc');
        } elseif ($request->sort == "price") {
            $availableRoomsQuery->orderBy('roomtypes.price');
        } elseif ($request->sort == "name") {
            $availableRoomsQuery->orderBy('hotels.name');
        } elseif ($request->sort == "star_rating") {
            $availableRoomsQuery->orderBy('hotels.star_rating', 'desc');
        }

        $availableRooms = $availableRoomsQuery->paginate(10);

        return $availableRooms;
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
        ->where('hotels.status', 'active')
        ->groupBy('roomtypes.id','roomtypes.name', 'roomtypes.price','roomtypes.description')
        ->havingRaw('COUNT(*) > DATEDIFF(?, ?)', [$end_date, $start_date])
        ->orderBy('roomtypes.price')->get();
        return $availableRooms;
    }
    public function searchByCountry(Request $request){
        $request->validate([
            'country' => 'required|string',
        ]);

        $results = Hotel::where('country', $request->country)->get();

        return $results;
    }
    public function searchByCity(Request $request){
        $request->validate([
            'city' => 'required|string',
        ]);

        $results = Hotel::where('city', $request->city)->get();

        return $results;
    }

    public function getAllCities() {
        $cities = Hotel::select('city')->distinct()->pluck('city');
        
        return response()->json($cities);
    }
    
    public function getAllCountries() {
        $cities = Hotel::select('country')->distinct()->pluck('country');
        
        return response()->json($cities);
    }


    public function getCitiesWithCountries() {
        $citiesWithCountries = \DB::table('hotels')
        ->select('city', 'country')
        ->distinct()
        ->get();

        return response()->json($citiesWithCountries);
    }
    
    


}
//  public function searchBetweenDates(Request $request)
//     {
//         $request->validate([
//             // 'start_date' => 'required|date|after_or_equal:today',
//             'start_date' => 'required|date',
//             'end_date' => 'required|date|after_or_equal:start_date',
//             'city' => 'required|string',
//         ]);

//         $city = $request->city;
//         $start_date = $request->start_date;
//         $end_date = $request->end_date;



//         $availableRooms = RoomType::select('roomtypes.id','roomtypes.name','roomtypes.price', 'roomtypes.hotel_id','hotels.name as hotel_name','hotels.photo','hotels.star_rating', DB::raw('AVG(rates.rate) as average_rate'))
//         ->join('availabilities', 'roomtypes.id', '=', 'availabilities.room_type_id')
//         ->join('hotels', 'roomtypes.hotel_id', '=', 'hotels.id')
//         ->join('rates', 'rates.hotel_id', '=', 'hotels.id')
//         ->where('availabilities.stock', '>', 0)
//         ->whereBetween('availabilities.date', [$start_date, $end_date])
//         ->where('hotels.city', $city)
//         ->groupBy('roomtypes.id', 'roomtypes.hotel_id','roomtypes.name','roomtypes.price','hotels.name','hotels.photo','hotels.star_rating','rates.hotel_id')
//         ->havingRaw('COUNT(*) > DATEDIFF(?, ?)', [$end_date, $start_date])
//         // ->orderBy('roomtypes.hotel_id')
//         // ->orderBy('roomtypes.price')
//         ->paginate(10);

//         if ($request->sort=="rate"){
//         $availableRooms = RoomType::select('roomtypes.id','roomtypes.name','roomtypes.price', 'roomtypes.hotel_id','hotels.name as hotel_name','hotels.photo','hotels.star_rating', DB::raw('AVG(rates.rate) as average_rate'))
//         ->join('availabilities', 'roomtypes.id', '=', 'availabilities.room_type_id')
//         ->join('hotels', 'roomtypes.hotel_id', '=', 'hotels.id')
//         ->join('rates', 'rates.hotel_id', '=', 'hotels.id')
//         ->where('availabilities.stock', '>', 0)
//         ->whereBetween('availabilities.date', [$start_date, $end_date])
//         ->where('hotels.city', $city)
//         ->groupBy('roomtypes.id', 'roomtypes.hotel_id','roomtypes.name','roomtypes.price','hotels.name','hotels.photo','hotels.star_rating','rates.hotel_id')
//         ->havingRaw('COUNT(*) > DATEDIFF(?, ?)', [$end_date, $start_date])
//         ->orderBy('average_rate', 'desc')
//         ->paginate(10);
//         }
//         if ($request->sort=="price"){
//         $availableRooms = RoomType::select('roomtypes.id','roomtypes.name','roomtypes.price', 'roomtypes.hotel_id','hotels.name as hotel_name','hotels.photo','hotels.star_rating', DB::raw('AVG(rates.rate) as average_rate'))
//         ->join('availabilities', 'roomtypes.id', '=', 'availabilities.room_type_id')
//         ->join('hotels', 'roomtypes.hotel_id', '=', 'hotels.id')
//         ->join('rates', 'rates.hotel_id', '=', 'hotels.id')
//         ->where('availabilities.stock', '>', 0)
//         ->whereBetween('availabilities.date', [$start_date, $end_date])
//         ->where('hotels.city', $city)
//         ->groupBy('roomtypes.id', 'roomtypes.hotel_id','roomtypes.name','roomtypes.price','hotels.name','hotels.photo','hotels.star_rating','rates.hotel_id')
//         ->havingRaw('COUNT(*) > DATEDIFF(?, ?)', [$end_date, $start_date])
//         // ->orderBy('roomtypes.hotel_id')
//         ->orderBy('roomtypes.price')
//         ->paginate(10);
//         }

//         if ($request->sort=="name"){
//         $availableRooms = RoomType::select('roomtypes.id','roomtypes.name','roomtypes.price', 'roomtypes.hotel_id','hotels.name as hotel_name','hotels.photo','hotels.star_rating', DB::raw('AVG(rates.rate) as average_rate'))
//         ->join('availabilities', 'roomtypes.id', '=', 'availabilities.room_type_id')
//         ->join('hotels', 'roomtypes.hotel_id', '=', 'hotels.id')
//         ->join('rates', 'rates.hotel_id', '=', 'hotels.id')
//         ->where('availabilities.stock', '>', 0)
//         ->whereBetween('availabilities.date', [$start_date, $end_date])
//         ->where('hotels.city', $city)
//         ->groupBy('roomtypes.id', 'roomtypes.hotel_id','roomtypes.name','roomtypes.price','hotels.name','hotels.photo','hotels.star_rating','rates.hotel_id')
//         ->havingRaw('COUNT(*) > DATEDIFF(?, ?)', [$end_date, $start_date])
//         // ->orderBy('roomtypes.hotel_id')
//         ->orderBy('hotels.name')
//         ->paginate(10);
//         }
//         if ($request->sort=="star_rating"){
//         $availableRooms = RoomType::select('roomtypes.id','roomtypes.name','roomtypes.price', 'roomtypes.hotel_id','hotels.name as hotel_name','hotels.photo','hotels.star_rating', DB::raw('AVG(rates.rate) as average_rate'))
//         ->join('availabilities', 'roomtypes.id', '=', 'availabilities.room_type_id')
//         ->join('hotels', 'roomtypes.hotel_id', '=', 'hotels.id')
//         ->join('rates', 'rates.hotel_id', '=', 'hotels.id')
//         ->where('availabilities.stock', '>', 0)
//         ->whereBetween('availabilities.date', [$start_date, $end_date])
//         ->where('hotels.city', $city)
//         ->groupBy('roomtypes.id', 'roomtypes.hotel_id','roomtypes.name','roomtypes.price','hotels.name','hotels.photo','hotels.star_rating','rates.hotel_id')
//         ->havingRaw('COUNT(*) > DATEDIFF(?, ?)', [$end_date, $start_date])
//         // ->orderBy('roomtypes.hotel_id')
//         ->orderBy('hotels.star_rating', 'desc')
//         ->paginate(10);
//         }
//         return $availableRooms;

//         // return AvailabilityResource::collection($availableRoom);

//     }
