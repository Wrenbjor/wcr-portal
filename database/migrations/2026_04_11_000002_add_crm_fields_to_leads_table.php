<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->enum('contact_status', ['not_contacted', 'attempted', 'contacted', 'follow_up', 'won', 'passed'])
                  ->default('not_contacted')
                  ->after('notes');
            $table->timestamp('contact_date')->nullable()->after('contact_status');
            $table->text('contact_notes')->nullable()->after('contact_date');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete()->after('contact_notes');
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropForeign(['assigned_to']);
            $table->dropColumn(['contact_status', 'contact_date', 'contact_notes', 'assigned_to']);
        });
    }
};
