<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

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
        $statuses = ['Pending', 'Under Review', 'Approved', 'Ready for Pickup', 'Declined', 'Completed'];

        return [
            'user_id' => User::factory(),
            'document_type' => $this->faker->randomElement($documentTypes),
            'purpose' => $this->faker->sentence(4),
            'notes' => $this->faker->optional()->paragraph(),
            'valid_id_path' => 'ids/1/sample-id.jpg', // You can use a placeholder or generate file if needed
            'preferred_pickup' => $this->faker->optional()->dateTimeBetween('+1 days', '+2 weeks'),
            'status' => $this->faker->randomElement($statuses),
        ];
    }
}
