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
        Schema::create('availabilities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('room_type_id'); 
            $table->foreign('room_type_id')->references('id')->on('roomtypes')->onDelete('cascade');
            $table->unsignedInteger('total_rooms')->default(0);
            $table->unsignedInteger('stock')->default(0);
            $table->date('date'); 
            $table->timestamps();
        });
        DB::statement('ALTER TABLE availabilities ADD CONSTRAINT stock_less_than_total_rooms CHECK (stock <= total_rooms)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('availabilities');
    }
};
