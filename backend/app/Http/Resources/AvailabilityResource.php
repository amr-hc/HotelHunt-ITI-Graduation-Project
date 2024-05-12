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
            // 'room' => $this->roomtype,
            // 'hotel' => $this->roomtype->hotel_id,
            'hotel_id' => $this->hotel,
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            // 'min_stock' => $this->min_stock
        ];

        // return parent::toArray($request);


    }
}
