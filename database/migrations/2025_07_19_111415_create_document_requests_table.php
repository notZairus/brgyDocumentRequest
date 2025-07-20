<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('document_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->onDelete('cascade');

            $table->string('document_type');
            $table->string('purpose');
            $table->text('notes')->nullable();
            $table->date('preferred_pickup')->nullable();

            $table->enum('status', ['Pending', 'Under Review', 'Approved', 'Ready for Pickup', 'Declined', 'Completed'])
                  ->default('Pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_requests');
    }
};
