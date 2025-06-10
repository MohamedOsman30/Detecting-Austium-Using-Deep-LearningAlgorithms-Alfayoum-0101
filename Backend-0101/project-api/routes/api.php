<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UpdateController;
use App\Http\Controllers\Api\AppointmentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DoctorsController;
use App\Http\Controllers\Api\PasswordResetController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::controller(AuthController::class)->group(function(){
    Route::post('register','register');
    Route::post('login','login');
});
Route::post('/doctors/register', [DoctorsController::class, 'register']);
Route::get('/doctors', [DoctorsController::class, 'doctors']);
Route::middleware('auth:sanctum')->post('/updatepassword', [UpdateController::class, 'updatepassword']);
Route::middleware('auth:sanctum')->post('/updateinfo', [UpdateController::class, 'updateinfo']);
Route::middleware('auth:sanctum')->post('/deleteaccount', [UpdateController::class, 'deleteaccount']);
Route::middleware('auth:sanctum')->post('/updateProfilePhoto', [UpdateController::class, 'updateProfilePhoto']);
Route::post('/appointments', [AppointmentController::class, 'appointments']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendOtp']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);


Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getUser']);

// In your routes/api.php
Route::middleware('auth:api')->group(function () {
    Route::get('/getAllAppointments', [AppointmentController::class, 'getAllAppointments']);
    Route::get('/getPatients', [AppointmentController::class, 'getPatients']);
    Route::post('/appointments/{id}/accept', [AppointmentController::class, 'acceptAppointment']);
    Route::delete('/appointments/{id}/delete', [AppointmentController::class, 'deleteAppointment']);
   
    Route::post('appointments/send-cancellation-emails', [AppointmentController::class, 'sendCancellationEmails']);
    Route::prefix('appointments')->group(function () {
        Route::post('/cancelation', [AppointmentController::class, 'cancelation']);
    });
    
});
Route::get('/appointment-details', [AppointmentController::class, 'getAppointmentDetails']);

Route::put('/profile/remove-photo', [UpdateController::class, 'removeProfilePhoto'])->middleware('auth:api');


Route::get('/confirm-payment', [AppointmentController::class, 'confirmPayment']);