<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Notifications\PasswordResetOtp;
use App\Http\Controllers\Controller;

class PasswordResetController extends Controller
{
    /**
     * Send OTP to the user's email.
     */
    public function sendOtp(Request $request)
    {
        // Validate the email input
        $request->validate(['email' => 'required|email']);

        // Check if the email exists in the users table
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        // Generate a 6-digit OTP
        $otp = rand(100000, 999999);

        // Hash the OTP for secure storage
        $hashedOtp = Hash::make($otp);

        // Store the hashed OTP in the password_resets table
        DB::table('password_resets')->updateOrInsert(
            ['email' => $user->email],
            ['token' => $hashedOtp, 'created_at' => now()]
        );

        // Send the OTP to the user's email
        $user->notify(new PasswordResetOtp($otp));

        return response()->json(['message' => 'OTP sent to your email']);
    }

    /**
     * Reset the password using the OTP.
     */
    public function resetPassword(Request $request)
    {
        // Validate the input
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Check if the email exists
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        // Retrieve the password reset record
        $reset = DB::table('password_resets')->where('email', $request->email)->first();
        if (!$reset) {
            return response()->json(['message' => 'Invalid or expired OTP'], 400);
        }

        // Verify the OTP
        if (!Hash::check($request->otp, $reset->token)) {
            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        // Check if the OTP has expired (default: 60 minutes)
        $expiration = config('auth.passwords.users.expire', 60);
        if (now()->diffInMinutes($reset->created_at) > $expiration) {
            return response()->json(['message' => 'OTP has expired'], 400);
        }

        // Update the user's password
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete the used OTP record
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password has been reset successfully']);
    }
}
