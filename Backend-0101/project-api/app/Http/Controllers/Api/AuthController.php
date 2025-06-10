<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{




    public function login(Request $request)
{
    // Validate the request
    $validator = Validator::make($request->all(), [
        'email' => 'required|string|email|max:255',
        'password' => 'required|string|min:8',
        'user_type' => 'required|in:user,doctor', // Ensure user_type is either 'user' or 'doctor'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $validator->errors()->all(),
        ], 422); // Return 422 Unprocessable Entity
    }

    // Determine guard based on user_type
    $guard = $request->user_type === 'user' ? 'user' : 'doctor';

    // Attempt authentication
    if (!Auth::guard($guard)->attempt(['email' => $request->email, 'password' => $request->password])) {
        return response()->json([
            'message' => 'Invalid credentials',
        ], 401); // 401 Unauthorized
    }

    // Get authenticated user
    $user = Auth::guard($guard)->user();

    // Ensure the user role matches
    if ($user->role !== $request->user_type) {
        return response()->json([
            'message' => 'Invalid user type',
        ], 403); // 403 Forbidden
    }

    // Generate a token for the authenticated user
    $token = $user->createToken('signuptoken')->plainTextToken;

    // Prepare response data
    $data = [
        'token' => $token,
        'first_name' => $user->first_name,
        'last_name' => $user->last_name,
        'email' => $user->email,
        'user_type' => $user->role,
        'photo' => $user->photo,
        'phone_number' => $user->phone_number,
        'price' => $user->price ?? null,
    ];

    if ($request->user_type === 'doctor') {
        // Include doctor-specific fields
        $data['title'] = $user->title ?? null;
        $data['time1'] = $user->time1 ?? null;
        $data['time2'] = $user->time2 ?? null;
        $data['Day1'] = $user->Day1 ?? null;
        $data['Day2'] = $user->Day2 ?? null;
    }

    return response()->json([
        'message' => 'User logged in successfully',
        'data' => $data,
    ], 200); // 200 OK
}


















    public function register(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
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

        // Create the user
        $user = User::create([
            'first_name' => $request->first_name, // Access validated data from $request
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone_number' => $request->input('phone_number', null),
            'password' => Hash::make($request->password),
            'role' => 'user', // Default role
            'status' => 'offline', // Default status
            'photo' => $photoPath, // Always use the default photo
            'session_id' => $sessionId, // Session ID
        ]);

      
        $data['first_name']=$user->first_name;
        $data['email']=$user->email;
        $data['photo']=$user->photo;
        $data['token'] = $user->createToken('signuptoken')->plainTextToken;
        // Return success response with the token
        return response()->json([
            'message' => 'User registered successfully',
            'data' => $data, // Include the token in the response
        ], 201); // 201 Created status code 

    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }






    



    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
    
            if (!$googleUser->email) {
                throw new \Exception('Google account email not found');
            }
    
            $user = User::where('email', $googleUser->email)->first();
    
            if (!$user) {
                $user = User::create([
                    'first_name' => $googleUser->user['given_name'] ?? 'Unknown',
                    'last_name' => $googleUser->user['family_name'] ?? 'User',
                    'email' => $googleUser->email,
                    'phone_number' => "00000",
                    'password' => Hash::make(Str::random(16)),
                    'role' => 'user',
                    'status' => 'offline',
                    'photo' =>  'storage/default/OIP.jpg',//$googleUser->avatar ??
                    'session_id' => Str::random(40),
                ]);
            }
    
            $token = $user->createToken('google-token')->plainTextToken;
    
            return redirect()->away(
                "http://localhost:3000/AuthCallback?token=" . urlencode($token)
            );
        } catch (\Exception $e) {
            \Log::error('Google OAuth Error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
    
            return redirect()->away(
                "http://localhost:3000/AuthCallback?error=" . urlencode($e->getMessage())
            );
        }
    }




    public function getUser(Request $request)
{
    try {
        $user = $request->user(); // Get the authenticated user
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json([
            'message' => 'User data retrieved successfully',
            'data' => [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'photo' => $user->photo,
                'phone_number' => $user->phone_number,
                'photo' =>  'storage/default/OIP.jpg',
                // Add other fields as needed
            ],
        ]);
    } catch (\Exception $e) {
        \Log::error('Get User Error: ' . $e->getMessage());
        return response()->json(['message' => 'Server error'], 500);
    }
}
    
}