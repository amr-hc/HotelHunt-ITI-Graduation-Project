<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;

use App\Models\Availability;
use App\Models\Roomtype;
use Illuminate\Http\Request;
// use Carbon\Carbon;

// use Illuminate\Support\Facades\DB;

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

    public function specificRoom(Roomtype $room)
    {
        return AvailabilityResource::collection($room->availability);
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
    public function show(string $id)
    {
        return new AvailabilityResource(Availability::findOrFail($id)); 
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $Availability=Availability::findOrFail($id);
        $Availability->update($request->all());
        return ["message"=> "updated"];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }



}
