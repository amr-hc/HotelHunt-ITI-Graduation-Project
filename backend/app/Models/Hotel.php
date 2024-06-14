<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    use HasFactory;
    protected $appends = ['average_rate','balancee'];

    protected $fillable = [
        'name','country','city','address','status','balance','text','owner_id','description',
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

    function book_details(){
        return $this->hasManyThrough(BookDetail::class, Roomtype::class);
    }

    public function getBalanceeAttribute()
    {
        return $this->payments()->sum('amount')-$this->book_details()->sum('book_details.price')*0.10;
    }


}
