<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;


class Hotel extends Model
{
    use HasFactory;
    protected $appends = ['average_rate','balance'];

    protected $fillable = [
        'name','country','city','address','status','text','owner_id','description',
    ];

    function user(){
        return $this->belongsTo(User::class , 'owner_id');
    }

    function rates(){
        return $this->hasMany(Rate::class);
    }

    public function getAverageRateAttribute()
    {
        if ($this->rates()->count() == 0) {
            return "0";
        }
        return $this->rates()->avg('rate');
    }

    function payments(){
        return $this->hasMany(Payment::class);
    }


    public function getBalanceAttribute()
    {
        $total_cost = DB::table('hotels')
        ->join('roomtypes', 'roomtypes.hotel_id', '=', 'hotels.id')
        ->join('book_details', 'book_details.roomtype_id', '=', 'roomtypes.id')
        ->join('booking', 'booking.id', '=', 'book_details.book_id')
        ->where('booking.status', 'completed')
        ->sum('book_details.price')*0.10;

        return $this->payments()->sum('amount')-$total_cost;
    }

    public function images(){
        return $this->hasMany(HotelImage::class);
    }


}
