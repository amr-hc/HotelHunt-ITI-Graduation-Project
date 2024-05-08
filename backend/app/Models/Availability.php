<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Availability extends Model
{
    use HasFactory;

    public function roomtype(): BelongsTo
    {
        
        return $this->belongsTo(Roomtype::class,'room_type_id');
    }



    public function hotel()
    {
        return $this->hasOneThrough(Hotel::class, Roomtype::class, 'id', 'id', 'room_type_id', 'hotel_id');
    }
    
}
