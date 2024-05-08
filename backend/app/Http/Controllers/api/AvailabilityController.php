<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;

use App\Models\Availability;
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
        // Retrieve availability records between the specified dates
        $availabilities = Availability::whereHas('roomType.hotel', function ($query) use ($city) {
            $query->where('city', $city);
        })->whereBetween('date', [$request->start_date, $request->end_date])
        ->groupBy('room_type_id')
        ->select('room_type_id', DB::raw('MIN(stock) as min_stock'))//->havingRaw('min_stock > 0')
        ->get();
        

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
