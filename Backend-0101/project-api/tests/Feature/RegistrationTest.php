<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
class RegistrationTest extends TestCase
{
/** @test */
public function user_can_register_with_valid_credentials()
{
    $response = $this->postJson('/api/register', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john.doe@example.com',
        'phone_number' => '+1234567890',
        'password' => 'Password123!'
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'data' => [
                'first_name',
                'email',
                'photo',
                'token'
            ]
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'john.doe@example.com',
        'first_name' => 'John'
    ]);
}

/** @test */
public function registration_fails_with_existing_email()
{
    // Create a user first
    User::factory()->create(['email' => 'existing@example.com']);

    $response = $this->postJson('/api/register', [
        'first_name' => 'Jane',
        'last_name' => 'Smith',
        'email' => 'existing@example.com', // Existing email
        'phone_number' => '+9876543210',
        'password' => 'SecurePass123!'
    ]);

    $response->assertStatus(422)
        ->assertJson([
            'message' => 'Validation error',
            'errors' => [
                'The email has already been taken.'
            ]
        ]);
}

/** @test */
/** @test */
public function registration_fails_with_invalid_email()
{
    $response = $this->postJson('/api/register', [
        'first_name' => 'Alex',
        'last_name' => 'Brown',
        'email' => 'invalid-email',
        'phone_number' => '+201234567890',
        'password' => 'ValidPass123!'
    ]);

    $response->assertStatus(422)
        ->assertJson([
            'message' => 'Validation error',
            'errors' => [
                'The email field must be a valid email address.'
            ]
        ]);
}

}