<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookDetailResource extends JsonResource
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
            'roomType_id' => $this->roomType_id,
            'book_id' => $this->book_id,
            'date' => $this->date,
            'price' => $this->price,
            'room_name' => $this->roomType->name,


        ];
    }
}
