<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Roomtype extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_id',
        'name',
        'description',
        'capacity',
        'price',
    ];

    public function hotel(): BelongsTo
    {

        return $this->belongsTo(Hotel::class);
    }
    public function availability()
    {
        return $this->hasMany(Availability::class, 'room_type_id');
    }

}
