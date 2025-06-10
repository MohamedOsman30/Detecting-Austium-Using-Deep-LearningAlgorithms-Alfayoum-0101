<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
class LoginTest extends TestCase
{
    
    use DatabaseTransactions;
    public function user_can_login_with_valid_credentials()
{
    // 1. Arrange - Create test user
    $user = User::factory()->create([
        'email' => 'mohamedd@gmail.com',
        'password' => bcrypt('963852741'), // Match the test password
        'role' => 'user'
    ]);

    // 2. Act - Make login request
    $response = $this->postJson('/api/login', [
        'email' => 'mohameddd@gmail.com',
        'password' => '963852741', // Must match the hashed password
        'user_type' => 'user'
    ]);

    // 3. Assert - Verify response
    $response->assertStatus(200)
        ->assertJsonStructure([
            'message',
            'data' => [
                'token',
                'first_name',
                'last_name',
                'email',
                'user_type',
                'photo',
                'phone_number'
            ]
        ]);
}
public function doctor_can_login_with_valid_credentials()
    {
        $doctor = Doctor::factory()->create([
            'email' => 'doctorr@test.com',
            'password' => bcrypt('password123'),
            'role' => 'doctor',
            'price' => 100,
            'title' => 'MD'
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'doctor@test.com',
            'password' => 'password123',
            'user_type' => 'doctor'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'token',
                    'first_name',
                    'last_name',
                    'email',
                    'user_type',
                    'photo',
                    'phone_number',
                    'price',
                    'title',
                    'time1',
                    'time2'
                ]
            ]);
    }

    /** @test */
    public function login_fails_with_invalid_credentials()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'mohamed@gmail.com',
            'password' => 'wrongpassword',
            'user_type' => 'user'
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Invalid credentials']);
    }


    public function login_fails_with_role_mismatch()
    {
        $user = User::factory()->create([
            'role' => 'user',
            'password' => bcrypt('963852741')
        ]);
    
        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => '963852741',
            'user_type' => 'doctor' // Wrong type
        ]);
    
        $response->assertStatus(401) // Changed from 403 to 401
            ->assertJson(['message' => 'Invalid credentials']); // Update message
    }

    



/** @test */
public function login_requires_valid_email()
{
    $response = $this->postJson('/api/login', [
        'email' => 'not-an-email',
        'password' => '963852741',
        'user_type' => 'user'
    ]);

    $response->assertStatus(422)
        ->assertJson([
            'message' => 'Validation error',
            'errors' => [
                'The email field must be a valid email address.'
            ]
        ]);
}

/** @test */
public function login_requires_password()
{
    $response = $this->postJson('/api/login', [
        'email' => 'user@test.com',
        'password' => '',
        'user_type' => 'user'
    ]);

    $response->assertStatus(422)
        ->assertJson([
            'message' => 'Validation error',
            'errors' => [
                'The password field is required.'
            ]
        ]);
}
 
}
