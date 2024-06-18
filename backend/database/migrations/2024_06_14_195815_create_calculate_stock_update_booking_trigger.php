<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared("
        CREATE TRIGGER calculate_stock_update_booking
        AFTER UPDATE ON booking
        FOR EACH ROW
        BEGIN
            UPDATE availabilities
            JOIN book_details ON availabilities.room_type_id = book_details.roomType_id AND availabilities.date = book_details.date
            SET availabilities.stock = availabilities.total_rooms - (
                SELECT COUNT(*)
                FROM book_details bd
                JOIN booking b ON bd.book_id = b.id
                WHERE bd.roomType_id = book_details.roomType_id
                AND bd.date = book_details.date
                AND b.status != 'cancel'
            );
        END
        ");

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP TRIGGER IF EXISTS calculate_stock_update_booking");
    }
};
