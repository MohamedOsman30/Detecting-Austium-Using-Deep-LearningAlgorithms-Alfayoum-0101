<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'photo',
        'child_name',
        'gender',
        'email',
        'phone',
        'age',
        'doctor',
        'day',
        'date', // Add this line
        'time',
        
        'price',
        'Availablety',
        'doctorname',
        'statue',
        'history',
        'stripe_session_id',
    ];
    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor'); // Match actual DB column name
    }
}