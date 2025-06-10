<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class UpdateController extends Controller
{

    public function updatepassword(Request $request)
    {
        // Validate input fields
        $validator = Validator::make($request->all(), [
            'new_password' => 'required|min:8|confirmed', // Ensure new password is confirmed
        ]);

        // If validation fails, return error response
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Get the authenticated user
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Update the password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully',
        ], 200);
    }






    public function updateinfo(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $request->user()->id,
            'phone_number' => 'string|max:255',
            'price' => 'string|max:255',
        ]);
    
        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()->all(),
            ], 422); // Return 422 Unprocessable Entity status code
        }
    
        // Get the authenticated user
        $user = $request->user();
    
        // Check if any fields are being updated
        $updated = false;
        if ($request->has('first_name') && $request->input('first_name') !== $user->first_name) {
            $user->first_name = $request->input('first_name');
            $updated = true;
        }
    
        if ($request->has('last_name') && $request->input('last_name') !== $user->last_name) {
            $user->last_name = $request->input('last_name');
            $updated = true;
        }
    
        if ($request->has('email') && $request->input('email') !== $user->email) {
            $user->email = $request->input('email');
            $updated = true;
        }
    
        if ($request->has('phone_number') && $request->input('phone_number') !== $user->phone_number) {
            $user->phone_number = $request->input('phone_number');
            $updated = true;
        }

        if ($request->has('price') && $request->input('price') !== $user->price) {
            $user->price = $request->input('price');
            $updated = true;
        }
    
        // Save the updated user information if any changes were made
        if ($updated) {
            $user->save();
            return response()->json([
                'message' => 'User information updated successfully',
                'user' => $user,
            ], 200); // Return 200 OK status code
        } else {
            return response()->json([
                'message' => 'No changes were made',
            ], 200); // Return 200 OK status code
        }
    }

    public function deleteaccount(Request $request)
    {
        // Validate the password field
        $request->validate([
            'password' => 'required|min:8',
        ]);
    
        // Get the authenticated user
        $user = Auth::user();
    
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        // Check if the entered password matches the user's current password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Incorrect password'], 403);
        }
    
        // Delete the user account
        $user->delete();
    
        return response()->json(['message' => 'Account deleted successfully'], 200);
    }
    
    public function updateProfilePhoto(Request $request)
    {
        try {
            // Validate the uploaded file
            $validator = Validator::make($request->all(), [
                'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max file size
            ]);
    
            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }
    
            // Get authenticated user
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
    
            
    
            // Store the new photo
            $file = $request->file('photo');
            $fileName = time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();
            $filePath = 'storage/default/' . $fileName;
    
            // Move file to public/storage/default
            $file->move(public_path('storage/default'), $fileName);
    
            // Update user profile with correct path
            $user->photo = $filePath;
            $user->save();
    
            return response()->json([
                'message' => 'Profile photo updated successfully',
                'photo_url' => asset($filePath), // Returns accessible URL
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
    
    public function removeProfilePhoto(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $defaultPhotoPath = 'storage/default/OIP.jpg';
            
            // Delete current photo if it's not the default
            if ($user->photo && $user->photo !== $defaultPhotoPath && 
                file_exists(public_path($user->photo))) {
                unlink(public_path($user->photo));
            }

            // Set to default photo
            $user->photo = $defaultPhotoPath;
            $user->save();

            return response()->json([
                'message' => 'Profile photo reset to default successfully',
                'photo_url' => asset($defaultPhotoPath),
                'user' => $user,
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }
}
