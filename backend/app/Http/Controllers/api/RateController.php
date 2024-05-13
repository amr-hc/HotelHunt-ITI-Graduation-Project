<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rate;
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
