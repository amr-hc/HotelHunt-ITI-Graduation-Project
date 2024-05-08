<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;

use App\Models\Roomtype;
use Illuminate\Http\Request;

class RoomtypesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Roomtype::all();
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Roomtype::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(Roomtype $roomtype)
    {
        //
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Roomtype $roomtype)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Roomtype $roomtype)
    {
        //
    }



}
