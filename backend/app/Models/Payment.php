<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $fillable = ['amount','hotel_id','method'];

    function hotel(){
        return  $this->belongsTo(Hotel::class);
    }
}
