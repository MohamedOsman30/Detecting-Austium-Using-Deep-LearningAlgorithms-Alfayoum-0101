<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class UpdateControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    // Tests for updatepassword method

    /** @test */
    public function update_password_fails_with_unauthenticated_user()
    {
        $response = $this->postJson('/api/updatepassword', [
            'new_password' => 'newpassword123',
            'new_password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Unauthenticated.']); 
    }

    /** @test */
    public function update_password_fails_with_invalid_password()
    {
        $user = User::factory()->create();
        try {
            Sanctum::actingAs($user, ['*']); 

            $response = $this->postJson('/api/updatepassword', [
                'new_password' => 'short',
                'new_password_confirmation' => 'short',
            ]);

            $response->assertStatus(422)
                     ->assertJsonValidationErrors(['new_password']);
        } finally {
            $user->delete();
        }
    }

    /** @test */
    public function update_password_fails_with_unconfirmed_password()
    {
        $user = User::factory()->create();
        try {
            Sanctum::actingAs($user, ['*']);

            $response = $this->postJson('/api/updatepassword', [
                'new_password' => 'newpassword123',
                'new_password_confirmation' => 'differentpassword123',
            ]);

            $response->assertStatus(422)
                     ->assertJsonValidationErrors(['new_password']);
        } finally {
            $user->delete();
        }
    }

    /** @test */
    public function update_password_succeeds_with_valid_input()
    {
        $user = User::factory()->create(['password' => Hash::make('oldpassword')]);
        try {
            Sanctum::actingAs($user, ['*']);

            $response = $this->postJson('/api/updatepassword', [
                'new_password' => 'newpassword123',
                'new_password_confirmation' => 'newpassword123',
            ]);

            $response->assertStatus(200)
                     ->assertJson(['message' => 'Password updated successfully']);

            $updatedUser = User::find($user->id);
            $this->assertTrue(Hash::check('newpassword123', $updatedUser->password));
        } finally {
            $user->delete();
        }
    }

    // Tests for updateinfo method

    /** @test */
    public function update_info_fails_with_unauthenticated_user()
    {
        $response = $this->postJson('/api/updateinfo', [
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Unauthenticated.']); // Updated to match actual response
    }

    /** @test */
    public function update_info_fails_with_invalid_email()
    {
        $user = User::factory()->create();
        try {
            Sanctum::actingAs($user, ['*']);

            $response = $this->postJson('/api/updateinfo', [
                'email' => 'invalid-email',
            ]);

            $response->assertStatus(422)
                     ->assertJson([
                         'message' => 'Validation error',
                         'errors' => ['The email field must be a valid email address.']
                     ]); // Updated to match actual flat array response
        } finally {
            $user->delete();
        }
    }

    /** @test */
    public function update_info_fails_with_duplicate_email()
    {
        $existingUser = User::factory()->create(['email' => 'existing@example.com']);
        $user = User::factory()->create();
        try {
            Sanctum::actingAs($user, ['*']);

            $response = $this->postJson('/api/updateinfo', [
                'email' => 'existing@example.com',
            ]);

            $response->assertStatus(422)
                     ->assertJson([
                         'message' => 'Validation error',
                         'errors' => ['The email has already been taken.']
                     ]); // Updated to match actual flat array response
        } finally {
            $existingUser->delete();
            $user->delete();
        }
    }

    /** @test */
    public function update_info_succeeds_with_valid_input()
    {
        $user = User::factory()->create([
            'first_name' => 'Old',
            'last_name' => 'Name',
            'email' => 'old@example.com',
        ]);
        try {
            Sanctum::actingAs($user, ['*']);

            $response = $this->postJson('/api/updateinfo', [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'new@example.com',
                'phone_number' => '1234567890',
            ]);

            $response->assertStatus(200)
                     ->assertJson(['message' => 'User information updated successfully'])
                     ->assertJsonStructure(['message', 'user']);

            $updatedUser = User::find($user->id);
            $this->assertEquals('John', $updatedUser->first_name);
            $this->assertEquals('Doe', $updatedUser->last_name);
            $this->assertEquals('new@example.com', $updatedUser->email);
            $this->assertEquals('1234567890', $updatedUser->phone_number);
        } finally {
            $user->delete();
        }
    }

    /** @test */
    public function update_info_returns_no_changes_if_same_data()
    {
        $user = User::factory()->create(['first_name' => 'John']);
        try {
            Sanctum::actingAs($user, ['*']);

            $response = $this->postJson('/api/updateinfo', [
                'first_name' => 'John',
            ]);

            $response->assertStatus(200)
                     ->assertJson(['message' => 'No changes were made']);
        } finally {
            $user->delete();
        }
    }

    // Tests for deleteaccount method

    /** @test */
    public function delete_account_fails_with_unauthenticated_user()
    {
        $response = $this->postJson('/api/deleteaccount', ['password' => 'password123']);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Unauthenticated.']); // Updated to match actual response
    }

    /** @test */
    public function delete_account_fails_with_invalid_password()
    {
        $user = User::factory()->create(['password' => Hash::make('password123')]);
        try {
            Sanctum::actingAs($user, ['*']);

            $response = $this->postJson('/api/deleteaccount', ['password' => 'wrongpassword']);

            $response->assertStatus(403)
                     ->assertJson(['message' => 'Incorrect password']);
        } finally {
            $user->delete();
        }
    }

    /** @test */
    public function delete_account_succeeds_with_valid_password()
    {
        $user = User::factory()->create(['password' => Hash::make('password123')]);
        try {
            Sanctum::actingAs($user, ['*']);

            $response = $this->postJson('/api/deleteaccount', ['password' => 'password123']);

            $response->assertStatus(200)
                     ->assertJson(['message' => 'Account deleted successfully']);

            $this->assertDatabaseMissing('users', ['id' => $user->id]);
        } finally {
            // No need to delete, as the endpoint deletes the user
        }
    }

    // Tests for updateProfilePhoto method

    /** @test */
    public function update_profile_photo_fails_with_unauthenticated_user()
    {
        $file = UploadedFile::fake()->image('photo.jpg');

        $response = $this->postJson('/api/updateProfilePhoto', ['photo' => $file]);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Unauthenticated.']); // Updated to match actual response
    }

    /** @test */
    public function update_profile_photo_fails_with_invalid_file()
    {
        $user = User::factory()->create();
        try {
            Sanctum::actingAs($user, ['*']);

            $file = UploadedFile::fake()->create('document.pdf');

            $response = $this->postJson('/api/updateProfilePhoto', ['photo' => $file]);

            $response->assertStatus(400)
                     ->assertJsonStructure(['message']);
        } finally {
            $user->delete();
        }
    }

    /** @test */
    public function update_profile_photo_fails_with_large_file()
    {
        $user = User::factory()->create();
        try {
            Sanctum::actingAs($user, ['*']);

            $file = UploadedFile::fake()->image('photo.jpg')->size(3000); 

            $response = $this->postJson('/api/updateProfilePhoto', ['photo' => $file]);

            $response->assertStatus(400)
                     ->assertJsonStructure(['message']);
        } finally {
            $user->delete();
        }
    }

   
    // Tests for removeProfilePhoto method

    /** @test */
    public function remove_profile_photo_fails_with_unauthenticated_user()
    {
        $response = $this->putJson('/api/profile/remove-photo');

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Unauthenticated.']); // Updated to match actual response
    }

    
}