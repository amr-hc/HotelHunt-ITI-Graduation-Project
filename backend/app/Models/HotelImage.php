<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelImage extends Model
{
    use HasFactory;

    protected $table = 'hotel_pictures';

    protected $fillable = ['hotel_id', 'images'];

    public function hotel(){
        return $this->belongsTo(Hotel::class);
    }
}
