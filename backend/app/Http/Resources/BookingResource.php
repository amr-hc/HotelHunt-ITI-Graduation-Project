<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            "user_name" => $this->user->fname . ' ' . $this->user->lname,
            'total_price' => $this->total_price,
            'duration' => $this->duration,
            'status' => $this->status,
            'hotel' => $this->HotelName,
            'check_in' => $this->check_in,
            'check_out' => $this->check_out,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            'book_details' => BookDetailResource::collection($this->whenLoaded('book_details')),




        ];
    }
}
