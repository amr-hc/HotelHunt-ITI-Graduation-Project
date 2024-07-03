<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            "hotel"=>$this->hotel->name,
            "amount"=>$this->amount,
            "method"=>$this->method,
            "date"=>$this->created_at,
            "balance"=> $this->hotel->balance,
        ];
    }
}
