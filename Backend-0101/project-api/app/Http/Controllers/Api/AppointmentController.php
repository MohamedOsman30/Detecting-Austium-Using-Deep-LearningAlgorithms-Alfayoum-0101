<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\Mail;
use App\Mail\AppointmentConfirmation;
use App\Mail\AppointmentCancellation;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

use Stripe\Stripe;
use Stripe\Checkout\Session;

class AppointmentController extends Controller
{
    // Create new appointment (existing)
    public function appointments(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'photo' => 'required|string|max:255',
                'child_name' => 'required|string|max:255',
                'gender' => 'required|string|in:Male,Female',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'age' => 'required|integer|min:1',
                'doctor' => 'required|integer',
                'day' => 'required|string|max:255',
                'date' => 'required|string|max:255',
                'time' => 'required|string|max:255',
                'price' => 'required|numeric|min:0.01',
                'doctorname' => 'required|string|max:255',
                'statue' => 'nullable|string|max:255',
                'history' => 'nullable|string',
            ]);

            $validatedData['statue'] = $validatedData['statue'] ?? 'Unpaid';
            $appointment = Appointment::create($validatedData);

            Stripe::setApiKey(config('services.stripe.secret'));

            $unitAmount = (int) ($appointment->price * 100);
            if ($unitAmount <= 0) {
                throw new \Exception('Invalid price: Unit amount must be greater than zero');
            }

            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'egp',
                        'product_data' => [
                            'name' => 'Appointment with ' . $appointment->doctorname,
                        ],
                        'unit_amount' => $unitAmount,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => 'http://localhost:3000/booking-success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => 'http://localhost:3000/booking-canceled',
                'metadata' => [
                    'appointment_id' => $appointment->id,
                ],
                'customer_email' => $appointment->email,
            ]);

            $appointment->stripe_session_id = $session->id;
            $appointment->save();

            Log::info('Stripe session created', [
                'session_id' => $session->id,
                'unit_amount' => $unitAmount,
                'appointment_id' => $appointment->id,
                'email' => $appointment->email,
            ]);

            return response()->json([
                'session_id' => $session->id,
                'appointment_id' => $appointment->id,
            ], 201);
        } catch (ValidationException $e) {
            Log::error('Validation error', ['errors' => $e->errors()]);
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Stripe session creation failed', ['message' => $e->getMessage()]);
            return response()->json([
                'error' => 'Server error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function confirmPayment(Request $request)
    {
        try {
            $sessionId = $request->query('session_id');
            if (!$sessionId) {
                
                return response()->json(['error' => 'Missing session_id'], 400);
            }

           

            Stripe::setApiKey(config('services.stripe.secret'));
            $session = Session::retrieve($sessionId);

            if ($session->payment_status !== 'paid') {
                
                return response()->json(['error' => 'Payment not completed'], 400);
            }

            $appointmentId = $session->metadata->appointment_id ?? null;
            if (!$appointmentId) {
              
                return response()->json(['error' => 'Invalid appointment ID'], 400);
            }

            $appointment = Appointment::find($appointmentId);
            if (!$appointment) {
               
                return response()->json(['error' => 'Appointment not found'], 404);
            }

            if ($appointment->statue!== 'Paid') {
                $appointment->statue = 'Paid';
                $appointment->save();
                

                try {
                    Mail::to($appointment->email)->send(new AppointmentConfirmation($appointment));
                    
                } catch (\Exception $e) {
                    Log::error('Failed to send confirmation email', ['email' => $appointment->email, 'error' => $e->getMessage()]);
                }
            }

            return response()->json([
                'message' => 'Payment confirmed',
                'appointment' => $appointment,
            ], 200);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            Log::error('Stripe API error in confirm-payment', [
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'error' => 'Stripe error',
                'message' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            Log::error('General error in confirm-payment', [
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'error' => 'Server error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // Get all appointments
 // AppointmentController.php
public function getAllAppointments()
{
    // Get the authenticated doctor's ID
    $doctorId = auth()->user()->id; // This assumes your doctors are users in your auth system
    
    $appointments = Appointment::where('doctor', $doctorId) // Cast to string since your doctor field is string
        ->get()
        ->makeHidden(['history', 'created_at', 'updated_at','stripe_session_id']);
    
    return response()->json([
        'data' => $appointments
    ]);
}


    // Get specific fields
    public function getAppointmentDetails()
    {
        $appointments = Appointment::select('doctor', 'day', 'time', 'date')->get();
        return response()->json([
            'data' => $appointments
        ]);
    }

    public function acceptAppointment($id)
{
    // Get the authenticated doctor's ID
    $doctorId = auth()->user()->id; // Use the 'doctor' guard

    // Find the appointment by ID
    $appointment = Appointment::find($id);

    // Check if the appointment exists
    if (!$appointment) {
        return response()->json(['message' => 'Appointment not found'], 404);
    }

    // Check if the appointment belongs to the authenticated doctor
    if ($appointment->doctor !== $doctorId) { // Cast to string for comparison
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    // Update the status to "Paid"
    $appointment->statue = 'Paid';
    $appointment->Availablety='Available';
    $appointment->save();

    return response()->json([
        'message' => 'Appointment status updated to Paid',
        'data' => $appointment
    ]);
}


public function getPatients()
{
    // Get the authenticated doctor's ID
    $doctorId = auth()->user()->id;

    $appointments = Appointment::where('doctor', $doctorId)
        ->where('statue', 'Paid')         // Check if payment is completed
        ->where('Availablety', 'Available') // Check if appointment is available
        ->get()
        ->makeHidden(['history', 'created_at', 'updated_at']);

    return response()->json([
        'data' => $appointments
    ]);
}


public function deleteAppointment($id)
{
    // Get the authenticated doctor's ID
    $doctorId = auth()->user()->id;

    // Find the appointment by ID
    $appointment = Appointment::find($id);

    // Check if the appointment exists
    if (!$appointment) {
        return response()->json(['message' => 'Appointment not found'], 404);
    }

    // Check if the appointment belongs to the authenticated doctor
    if ($appointment->doctor !== $doctorId) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    // Delete the appointment
    $appointment->delete();

    return response()->json([
        'message' => 'Appointment deleted successfully',
        'data' => $appointment
    ]);
}














public function cancelation(Request $request) 
{
    DB::beginTransaction();
    try {
        $doctor = auth()->user();
        if (!$doctor) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Handle input formats: "[25,26,27]", "25,26,27", etc.
        $input = $request->input('appointment_ids', '');
        if (is_string($input)) {
            // Remove brackets and whitespace, then split by commas
            $input = trim($input, " \t\n\r\0\x0B[]");
            $input = explode(',', $input);
            $input = array_filter($input, fn($v) => $v !== '');
        }

        // Convert to integers and validate
        $validIds = array_unique(array_filter(array_map('intval', (array)$input), fn($id) => $id > 0));

        if (empty($validIds)) {
            return response()->json(['message' => 'No valid appointment IDs provided'], 400);
        }

        // Debug: Log processed IDs
        \Log::info('Valid Appointment IDs:', $validIds);

        // Get qualifying appointments
        $appointments = Appointment::where('doctor', $doctor->id)
            ->where('statue', 'Paid')
            ->where('Availablety', 'Available') // Match exact DB column name!
            ->whereIn('id', $validIds)
            ->lockForUpdate()
            ->get();

        // Debug: Log found appointments
        \Log::info('Matched Appointments:', $appointments->toArray());

        if ($appointments->isEmpty()) {
            return response()->json(['message' => 'No matching appointments found'], 404);
        }

        // Update records
        $updatedCount = Appointment::whereIn('id', $appointments->pluck('id'))
            ->update([
                'Availablety' => 'Unavailable', // Match DB column name
                'statue' => 'Cancelled'
            ]);

        DB::commit();

        return response()->json([
            'success' => true,
            'updated' => $updatedCount,
            'processed_ids' => $appointments->pluck('id')->toArray()
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Cancellation failed: ' . $e->getMessage()
        ], 500);
    }
}



public function sendCancellationEmails(Request $request)
{
    try {
        $doctor = auth()->user();
        if (!$doctor) return response()->json(['message' => 'Unauthorized'], 401);

        // Handle different input formats
        $inputIds = $request->input('appointment_ids', []);
        
        // Convert string "[18,16]" to array
        if (is_string($inputIds)) {
            $inputIds = json_decode($inputIds, true) ?? explode(',', trim($inputIds, '[]'));
        }

        // Validate IDs
        $validIds = array_filter(array_map('intval', (array)$inputIds), fn($id) => $id > 0);

        if (empty($validIds)) {
            return response()->json(['message' => 'No valid appointment IDs'], 400);
        }

        // Rest of your code remains the same...
        $appointments = Appointment::with('doctor')
            ->where('doctor', $doctor->id)
            ->where('Availablety', 'Unavailable')
            ->whereIn('id', $validIds)
            ->get();

        $failedEmails = [];
        $emailList = $appointments->pluck('email'); // Get all emails

        foreach ($appointments as $appt) {
            try {
                Mail::to($appt->email)
                    ->send(new AppointmentCancellation($appt));
            } catch (\Exception $e) {
                $failedEmails[] = [
                    'id' => $appt->id,
                    'email' => $appt->email,
                    'error' => $e->getMessage()
                ];
                Log::error("Email failed for appointment {$appt->id}", [
                    'error' => $e->getMessage(),
                    'email' => $appt->email,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'emails' => $emailList, // Return email list
            'emails_sent' => $appointments->count() - count($failedEmails),
            'failed_emails' => $failedEmails
        ]);

    } catch (\Exception $e) {
        Log::error("Email sending failed: " . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Email sending failed: ' . $e->getMessage(),
        ], 500);
    }
}
}