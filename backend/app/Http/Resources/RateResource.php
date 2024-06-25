<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=>$this->id,
            "user"=>$this->user->fname . ' '. $this->user->lname,
            "hotel"=>$this->hotel->name,
            "rate"=>$this->rate,
            "hotel_id"=>$this->hotel_id,
            "user_id"=>$this->user_id
        ];
    }
}
