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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('photo');
            $table->string('child_name');
            $table->string('gender');
            $table->string('email');
            $table->string('phone');
            $table->integer('age');
            $table->bigInteger('doctor');
            $table->string('day');
            $table->string('time');
            $table->string('price'); 
            $table->string('doctorname');
            $table->string('Availablety')->default('Available'); 
            $table->string('statue')->default('Unpaid'); 
            $table->string('date');
            $table->text('history')->nullable();
            $table->string('stripe_session_id')->nullable();;
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};