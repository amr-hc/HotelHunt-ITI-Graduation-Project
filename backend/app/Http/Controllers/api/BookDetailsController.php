<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BookDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\BookDetailResource;

class BookDetailsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookDetails = BookDetail::all();
        return BookDetailResource::collection($bookDetails);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $bookDetail = BookDetail::find($id);

        if (!$bookDetail) {
            return response()->json(['message' => 'Book detail not found'], 404);
        }

        return new BookDetailResource($bookDetail);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}
