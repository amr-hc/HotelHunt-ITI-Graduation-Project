<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HotelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request)
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "owner_id" => $this->user->fname . ' '. $this->user->lname,
            "city" => $this->city,
            "country" => $this->country,
            "address" => $this->address,
            "status" => $this->status,
            "balance" => $this->balance,
            "average_rate" => $this->average_rate,
            "description" => $this->description,
            "star_rating" => $this->star_rating,
            
            
        ];
    }
}
