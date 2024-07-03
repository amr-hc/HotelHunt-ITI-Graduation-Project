<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookDetail extends Model
{
    use HasFactory;
    protected $table = 'book_details'; // Explicitly set the table name
    protected $fillable = [
        'roomType_id',
        'book_id',
        'date',
        'price',
    ];

    public function roomType()
    {
        return $this->belongsTo(Roomtype::class, 'roomType_id');
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'book_id');
    }

}
