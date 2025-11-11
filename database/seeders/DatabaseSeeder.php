<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Database\Seeders\DocumentRequestSeeder;
use Database\Seeders\DocumentSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->admin()->create([
            'name' => 'Admin Bermillo',
            'email' => 'admin@gmail.com',
            'sitio' => 'Matictic Proper',
            'password' => 'QZr8408o'
        ]);

        // User::factory()->create([
        //     'name' => 'Zairus Bermillo',
        //     'email' => 'notzairus@gmail.com',
        //     'sitio' => 'Matictic Proper',
        //     'password' => 'QZr8408o'
        // ]);

        $this->call(
            DocumentSeeder::class
        );

        $this->call(
            DocumentRequestSeeder::class
        );
    }
}
