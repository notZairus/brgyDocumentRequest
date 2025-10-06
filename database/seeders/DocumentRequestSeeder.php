<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DocumentRequest;

class DocumentRequestSeeder extends Seeder
{
    
    public function run(): void
    {
        DocumentRequest::factory(50)->create();
    }
}

