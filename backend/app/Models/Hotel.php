<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    use HasFactory;
    protected $appends = ['average_rate'];

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


}
