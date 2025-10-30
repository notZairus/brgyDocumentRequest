<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\StatusEnum;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DocumentRequest>
 */
class DocumentRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $documentTypes = ['Barangay Clearance', 'Certificate of Indigency', 'Certificate of Residency', 'Certificate of Employment'];
        $user = User::factory();
        $document_details = [
            'Certificate of Indigency' => [
                "name" => 'Dummy Name',
                "sitio" => "Matictic Proper", 
                "purpose" => "Medical Assistance", 
                "civil_status" => null
            ],
            'Certificate of Employment' => [
                "name" => 'Dummy Name', 
                "sitio" => "Matictic Proper", 
                "purpose" => null, 
                "civil_status" => null,
                "income" => "one thousand pesos (₱1,000.00)",
                "occupation" => "Construction Worker",
            ],
            'Certificate of Residency' => [
                "name" => 'Dummy Name', 
                "sitio" => "Matictic Proper", 
                "purpose" => null, 
                "civil_status" => "Single"
            ],
            'Barangay Clearance' => [
                "name" => 'Dummy Name', 
                "sitio" => "Matictic Proper", 
                "purpose" => "MTOP", 
                "civil_status" => "Divorced"
            ]
        ];

        $type = $this->faker->randomElement($documentTypes);



        return [
            'user_id' => $user,
            'price' => 0,
            'document_type' => $type,
            'notes' => $this->faker->optional()->paragraph(),
            'document_details' => $document_details[$type],
            'status' => $this->faker->randomElement(StatusEnum::cases()),
        ];
    }

    public function pending() {
        return $this->state(fn ($attributes) => [
            'status' => 'Pending',        
        ]);
    }
}
