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
            'room' => $this->roomtype,
            // 'hotel' => $this->roomtype->hotel_id,
            'hotel' => $this->hotel,
            'min_stock' => $this->min_stock
        ];
    }
}
