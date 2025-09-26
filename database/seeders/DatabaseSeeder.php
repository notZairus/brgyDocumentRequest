<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\DocumentRequest;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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
            'sitio' => 'Matictic',
            'password' => 'QZr8408o'
        ]);

        User::factory()->create([
            'name' => 'Wency Cain',
            'email' => 'wency@gmail.com',
            'sitio' => 'Kanyakan',
            'password' => 'qwertyuiop'
        ]);

        User::factory()->create([
            'name' => 'Zairus V. Bermillo',
            'email' => 'zairusb12@gmail.com',
            'sitio' => 'Matictic Proper',
            'password' => 'qwertyuiop'
        ]);
    }
}
