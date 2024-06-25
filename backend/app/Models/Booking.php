<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $table = 'booking';

    protected $appends = ['total_price'];
    protected $fillable = [
        'id','user_id',
        'total_price', 'duration', 'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function book_details()
    {
        return $this->hasMany(BookDetail::class, 'book_id');
    }
    public function getTotalPriceAttribute()
    {
        return $this->book_details()->sum('price');
    }

    public function getHotelNameAttribute()
    {
        return $this->book_details->first()->roomType->hotel->name;
    }



}
