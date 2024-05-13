<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name','country','city','address','status','balance','average_rate','text','owner_id','description'
    ];

    function user(){
        return $this->belongsTo(User::class , 'owner_id');
    }

    function rates(){
        return $this->hasMany(Rate::class);
    }
}
