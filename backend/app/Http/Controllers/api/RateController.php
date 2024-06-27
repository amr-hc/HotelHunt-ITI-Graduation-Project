<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rate;
use App\Models\Hotel;
use App\Models\User;
use App\Http\Resources\RateResource;

class RateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rates = Rate::all();
        return RateResource::collection($rates);
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
        Rate::create($request->all());
        
    }

    /**
     * Display the specified resource.
     */
    public function show( $id)
    {
        return new RateResource(Rate::findOrFail($id));
    }


    public function RateByUser(User $user){
        $rates = $user->rates()->get()->pluck('pivot');;
        return $rates;
    }
    public function RateByHotel(Hotel $hotel){
        $rates = $hotel->rates()->get()->pluck('pivot');;
        return $rates;
    }

    public function RateByHotelforlogin(Hotel $hotel){
        $rates = $hotel->rates()->where('user_id',auth()->user()->id)->first()->pivot;
        return $rates;
    }
    public function RateByUserHotel(Hotel $hotel, User $user){
        $rates = $hotel->rates()->where('user_id',$user->id)->first()->pivot;
        return $rates;
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $rate=Rate::findOrFail($id);
        $rate->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $rate = Rate::destroy($id);
    }
}
