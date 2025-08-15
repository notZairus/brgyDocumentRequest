<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\DocumentRequest;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'User Bermillo',
            'email' => 'user@gmail.com',
            'password' => 'QZr8408o'
        ]);

        User::factory()->admin()->create([
            'name' => 'Admin Bermillo',
            'email' => 'admin@gmail.com',
            'password' => 'QZr8408o'
        ]);

        
    }
}
