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
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('owner_id');
            $table->foreign('owner_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('name')->unique();
            $table->string('country');
            $table->string('city');
            $table->string('address');
            $table->enum('status', ['active', 'inactive', 'suspend'])->default('inactive');
            $table->unsignedInteger('star_rating')->default(1);
            $table->decimal('balance', 8, 2)->default(0.00);
            $table->decimal('average_rate', 8, 2)->default(0.00);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
