<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Doctor; // Import the Doctor model
use Illuminate\Support\Facades\Validator; // For validation
use Illuminate\Support\Facades\Hash; // For password hashing
use Illuminate\Support\Facades\Auth; // For token generation

class DoctorsController extends Controller
{
    /**
     * Get all records from the doctors table.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function doctors()
    {
        // Fetch all doctors from the database with specific fields
        $doctors = Doctor::select(
            'id',
            'first_name',
            'last_name',
            'phone_number',
            'title',
            'photo',
            'price',
            'Day1',
            'Day2',
            'time1',
            'time2'
        )->get();

        // Return the doctors as a JSON response
        return response()->json([
            'status' => 'success',
            'message' => 'Doctors retrieved successfully',
            'data' => $doctors,
        ], 200);
    }

    /**
     * Register a new doctor.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:doctors',
            'phone_number' => 'required|string|max:255',
            'password' => 'required|string|min:8',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()->all(),
            ], 422); // Return 422 Unprocessable Entity status code
        }

        // Use the default photo
        $photoPath = 'storage/default/OIP.jpg'; // Default photo path

        // Generate session ID
        $sessionId = rand(time(), 100000000); // Random session ID

        // Create the doctor
        $doctor = Doctor::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
            'title' => $request->title,
            'role' => 'doctor', // Default role
            'status' => 'Offline now', // Default status
            'photo' => $photoPath, // Default photo
            'session_id' => $sessionId, // Session ID
            'chat_pass' => 123456, // Explicitly set chat_pass
            'price' => $request->price,
            'Day1' => $request->Day1,
            'Day2' => $request->Day2,
            'time1' => $request->time1,
            'time2' => $request->time2,
        ]);

        // Prepare response data
        $data['first_name'] = $doctor->first_name;
        $data['email'] = $doctor->email;
        $data['photo'] = $photoPath;
        $data['token'] = $doctor->createToken('signuptoken')->plainTextToken; // Generate token

        // Return success response with the token
        return response()->json([
            'message' => 'Doctor registered successfully',
            'data' => $data,
        ], 201); // 201 Created status code
    }
}