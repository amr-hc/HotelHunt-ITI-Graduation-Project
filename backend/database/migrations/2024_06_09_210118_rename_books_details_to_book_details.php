<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameBooksDetailsToBookDetails extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::rename('books_details', 'book_details');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('book_details', 'books_details');
    }
}
