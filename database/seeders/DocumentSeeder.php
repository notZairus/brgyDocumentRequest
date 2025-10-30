<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Document;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $documents = [
            [
                'type' => 'Certificate of Indigency',
                'price' => 0,
                'information' => json_encode([
                    ['label' => 'Name', 'type' => 'text', 'required' => true, 'placeholder' => 'John Doe'],
                    ['label' => 'Purpose', 'type' => 'select', 'options' => ['Educational Assistance', 'Financial Assistance', 'Medical Assistance'], 'required' => true, 'placeholder' => 'Select a purpose'],
                    ['label' => 'Sitio', 'type' => 'select', 'options' => ['Matictic Proper',  'Riverside', 'Coral', 'Sapang Kawayan',  'Dynamite',  'Malaganit',  'Padling', 'Gulod', 'Kanyakan', 'Lupa'], 'required' => true, 'placeholder' => 'Select a sitio'],
                ]),
                'path' => '',
            ],
            [
                'type' => 'Certificate of Residency',
                'price' => 0,
                'information' => json_encode([
                    ['label' => 'Name', 'type' => 'text', 'required' => true, 'placeholder' => 'John Doe'],
                    ['label' => 'Civil_Status', 'type' => 'select', 'options' => ['Single', 'Married', 'Divorced', 'Widowed'], 'required' => true, 'placeholder' => 'Select a civil status'],
                    ['label' => 'Sitio', 'type' => 'select', 'options' => ['Matictic Proper',  'Riverside', 'Coral', 'Sapang Kawayan',  'Dynamite',  'Malaganit',  'Padling', 'Gulod', 'Kanyakan', 'Lupa'], 'required' => true, 'placeholder' => 'Select a sitio'],
                ]),
                'path' => '',
            ],
            [
                'type' => 'Certificate of Employment',
                'price' => 0,
                'information' => json_encode([
                    ['label' => 'Name', 'type' => 'text', 'required' => true, 'placeholder' => 'John Doe'],
                    ['label' => 'Occupation', 'type' => 'text', 'required' => true, 'placeholder' => 'Enter your occupation'],
                    ['label' => 'Sitio', 'type' => 'select', 'options' => ['Matictic Proper',  'Riverside', 'Coral', 'Sapang Kawayan',  'Dynamite',  'Malaganit',  'Padling', 'Gulod', 'Kanyakan', 'Lupa'], 'required' => true, 'placeholder' => 'Select a sitio'],
                    ['label' => 'Income', 'type' => 'select', 'options' => ['one thousand pesos (₱1,000)', 'two thousand pesos (₱2,000)', 'three thousand pesos (₱3,000)', 'four thousand pesos (₱4,000)', 'five thousand pesos (₱5,000)', 'six thousand pesos (₱6,000)', 'seven thousand pesos (₱7,000)', 'eight thousand pesos (₱8,000)', 'nine thousand pesos (₱9,000)', 'ten thousand pesos (₱10,000)'], 'required' => true, 'placeholder' => 'Enter your monthly income'],
                ]),
                'path' => '',
            ],
            [
                'type' => 'Barangay Clearance',
                'price' => 50,
                'information' => json_encode([
                    ['label' => 'Name', 'type' => 'text', 'required' => true, 'placeholder' => 'John Doe'],
                    ['label' => 'Purpose', 'type' => 'select', 'options' => ['Employment', 'Loan', 'MTOP', 'Postal ID'], 'required' => true, 'placeholder' => 'Select a purpose'],
                    ['label' => 'Civil_Status', 'type' => 'select', 'options' => ['Single', 'Married', 'Divorced', 'Widowed'], 'required' => true, 'placeholder' => 'Select a civil status'],
                    ['label' => 'Sitio', 'type' => 'select', 'options' => ['Matictic Proper',  'Riverside', 'Coral', 'Sapang Kawayan',  'Dynamite',  'Malaganit',  'Padling', 'Gulod', 'Kanyakan', 'Lupa'], 'required' => true, 'placeholder' => 'Select a sitio'],
                ]),
                'path' => '',
            ],
        ];

        foreach ($documents as $document) {
            Document::create($document);
        }
    }
}
