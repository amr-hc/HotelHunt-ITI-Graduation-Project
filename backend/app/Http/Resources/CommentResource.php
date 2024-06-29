<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
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
            "content"=> $this->content,
            "created_at"=> $this->created_at,
            "user_id"=> $this->user_id,
            "user_name"=> $this->user->fname . ' ' . $this->user->lname,
            "photo"=> $this->user->photo ,
            "hotel_id"=> $this->hotel_id,
        ];


    }
}
