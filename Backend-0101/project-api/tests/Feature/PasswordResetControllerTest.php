<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\PasswordResetOtp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetControllerTest extends TestCase
{
    use RefreshDatabase;

    // Tests for sendOtp method

    /** @test */
    public function send_otp_fails_with_invalid_email()
    {
        $response = $this->postJson('api/forgot-password', ['email' => 'invalid']);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function send_otp_fails_with_non_existent_email()
    {
        $response = $this->postJson('api/forgot-password', ['email' => 'nonexistent@example.com']);

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Email not found']);
    }

    /** @test */
    public function send_otp_succeeds_with_valid_email()
    {
        Notification::fake();

        $user = User::factory()->create();

        $response = $this->postJson('api/forgot-password', ['email' => $user->email]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'OTP sent to your email']);

        $this->assertDatabaseHas('password_resets', ['email' => $user->email]);
        Notification::assertSentTo($user, PasswordResetOtp::class);
    }

    // Tests for resetPassword method

    /** @test */
    public function reset_password_fails_with_missing_fields()
    {
        $response = $this->postJson('api/reset-password', [
            'otp' => '123456',
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function reset_password_fails_with_non_existent_email()
    {
        $response = $this->postJson('api/reset-password', [
            'email' => 'nonexistent@example.com',
            'otp' => '123456',
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ]);

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Email not found']);
    }

    /** @test */
    public function reset_password_fails_with_no_reset_record()
    {
        $user = User::factory()->create();

        $response = $this->postJson('api/reset-password', [
            'email' => $user->email,
            'otp' => '123456',
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ]);

        $response->assertStatus(400)
                 ->assertJson(['message' => 'Invalid or expired OTP']);
    }

    /** @test */
    public function reset_password_fails_with_invalid_otp()
    {
        $user = User::factory()->create();
        $otp = '123456';
        $hashedOtp = Hash::make($otp);

        DB::table('password_resets')->insert([
            'email' => $user->email,
            'token' => $hashedOtp,
            'created_at' => now(),
        ]);

        $response = $this->postJson('api/reset-password', [
            'email' => $user->email,
            'otp' => 'wrongotp',
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ]);

        $response->assertStatus(400)
                 ->assertJson(['message' => 'Invalid OTP']);
    }

    /** @test */
    public function reset_password_fails_with_expired_otp()
    {
        $user = User::factory()->create();
        $otp = '123456';
        $hashedOtp = Hash::make($otp);

        DB::table('password_resets')->insert([
            'email' => $user->email,
            'token' => $hashedOtp,
            'created_at' => now()->subMinutes(61), // Expired (default 60 minutes)
        ]);

        $response = $this->postJson('api/reset-password', [
            'email' => $user->email,
            'otp' => $otp,
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword',
        ]);

        $response->assertStatus(400)
                 ->assertJson(['message' => 'OTP has expired']);
    }

    /** @test */
    public function reset_password_succeeds_with_valid_otp()
    {
        $user = User::factory()->create(['password' => Hash::make('oldpassword')]);
        $otp = '123456';
        $hashedOtp = Hash::make($otp);

        DB::table('password_resets')->insert([
            'email' => $user->email,
            'token' => $hashedOtp,
            'created_at' => now(),
        ]);

        $newPassword = 'newpassword';

        $response = $this->postJson('api/reset-password', [
            'email' => $user->email,
            'otp' => $otp,
            'password' => $newPassword,
            'password_confirmation' => $newPassword,
        ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Password has been reset successfully']);

        $user->refresh();
        $this->assertTrue(Hash::check($newPassword, $user->password));
        $this->assertDatabaseMissing('password_resets', ['email' => $user->email]);
    }

    /** @test */
    public function reset_password_fails_with_unconfirmed_password()
    {
        $user = User::factory()->create();
        $otp = '123456';
        $hashedOtp = Hash::make($otp);

        DB::table('password_resets')->insert([
            'email' => $user->email,
            'token' => $hashedOtp,
            'created_at' => now(),
        ]);

        $response = $this->postJson('api/reset-password', [
            'email' => $user->email,
            'otp' => $otp,
            'password' => 'newpassword',
            'password_confirmation' => 'differentpassword',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['password']);
    }
}