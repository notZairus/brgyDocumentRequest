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
        $documentTypes = ['Barangay Clearance', 'Certificate of Indigency', 'Certificate of Residency'];

        return [
            'user_id' => User::factory(),
            'document_type' => $this->faker->randomElement($documentTypes),
            'notes' => $this->faker->optional()->paragraph(),
            'document_details' => null,
            'status' => $this->faker->randomElement(StatusEnum::cases()),
        ];
    }

    public function pending() {
        return $this->state(fn ($attributes) => [
            'status' => 'Pending',        
        ]);
    }
}
