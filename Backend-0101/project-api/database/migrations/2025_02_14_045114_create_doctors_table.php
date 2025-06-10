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
        Schema::create('doctors', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('first_name'); // First name of the doctor
            $table->string('last_name'); // Last name of the doctor
            $table->string('email')->unique(); // Unique email address
            $table->string('phone_number'); // Phone number
            $table->string('password'); // Password for authentication
            $table->string('title');
            $table->string('role')->default('doctor'); // Role, default is 'doctor'
            $table->string('status')->default('Offline now'); // Status, default is 'offline'
            $table->string('photo')->nullable(); // Path to the doctor's photo (nullable)
            $table->string('session_id')->nullable(); // Session ID, nullable
            $table->bigInteger('chat_pass'); // Chat pass (nullable)
            $table->Integer('price');
            $table->string('Day1');
            $table->string('Day2');
            $table->Integer('time1');
            $table->Integer('time2');
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors'); // Drop the table if the migration is rolled back
    }
};