<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Availability extends Model
{
    use HasFactory;

    protected $fillable = [
        'total_rooms','room_type_id','date','stock'
    ];

    public function roomtype(): BelongsTo
    {
        
        return $this->belongsTo(Roomtype::class,'room_type_id');
    }



    public function hotel()
    {
        return $this->hasOneThrough(Hotel::class, Roomtype::class, 'id', 'id', 'room_type_id', 'hotel_id');
    }

    public function book_details()
    {
        return $this->hasMany(BookDetail::class,'roomType_id','room_type_id')
        ->where('date', $this->date);
    }
    
}
