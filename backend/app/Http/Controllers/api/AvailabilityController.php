<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;

use App\Models\Availability;
use App\Models\Roomtype;
use Illuminate\Http\Request;
use Carbon\Carbon;

use Illuminate\Support\Facades\DB;

use App\Http\Resources\AvailabilityResource;

class AvailabilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return Availability::all();
        return AvailabilityResource::collection(Availability::all());
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
    public function store(Request $request)
    {
        Availability::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(Availability $availability)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Availability $availability)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Availability $availability)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Availability $availability)
    {
        //
    }



    public function searchBetweenDates(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'city' => 'required|string'
        ]);

        $city = $request->city;
        $start_date = $request->start_date;
        $end_date = $request->end_date;

    //     $query = "
    //     SELECT roomtypes.id , roomtypes.hotel_id
    //     FROM availabilities
    //     INNER JOIN roomtypes ON roomtypes.id = availabilities.room_type_id
    //     INNER JOIN hotels ON roomtypes.hotel_id = hotels.id
    //     WHERE availabilities.stock > 0 AND availabilities.date BETWEEN '$start_date' AND '$end_date' AND hotels.city='$city'
    //     GROUP by roomtypes.id ,roomtypes.hotel_id
    //     HAVING COUNT(*) > DATEDIFF('$end_date', '$start_date')
    //     ORDER BY roomtypes.hotel_id, roomtypes.price        
    //     limit 10 offset 0;        
    //     ";
    
    // $availabilities = DB::select($query);
        // return $availabilities;


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

        // return $availabilities;

        return AvailabilityResource::collection($availabilities);

        // Return the response
        // return $availabilities;
    }









        /**
     * Search for availabilities between two dates in a specific city.
     *
     */
    // public function searchBetweenDates(Request $request)
    // {
    //     // Validate request parameters
    //     $request->validate([
    //         'start_date' => 'required|date',
    //         'end_date' => 'required|date|after:start_date',
    //         'city' => 'required|string',
    //     ]);

    //     // Retrieve search parameters
    //     $startDate = Carbon::parse($request->input('start_date'));
    //     $endDate = Carbon::parse($request->input('end_date'));
    //     $city = $request->input('city');

    //     // Retrieve availabilities based on search parameters
    //     $availabilities = Availability::whereHas('roomType.hotel', function ($query) use ($city) {
    //         $query->where('city', $city);
    //     })
    //     ->whereBetween('date', [$startDate, $endDate])
    //     ->get();

    //     return response()->json($availabilities);
    // }

}
