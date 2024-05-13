<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AvailabilityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            "id"=> $this->id,
            "stock"=> $this->stock,
            "date"=> $this->date,
            "room_type_id"=> $this->room_type_id,
            "room_type"=> $this->roomtype->name,
            "hotel_id"=> $this->hotel->id,
            "hotel_name"=> $this->hotel->name,
        ];


    }
}
