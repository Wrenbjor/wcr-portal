<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('business_name');
            $table->string('trade_type');
            $table->string('category'); // trades, lawyers, smb
            $table->string('contact_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('city');
            $table->string('state')->default('NJ');
            $table->string('repo_name');
            $table->string('demo_code', 10)->unique();
            $table->string('demo_url');
            $table->string('github_url');
            $table->string('tier')->nullable(); // starter, growth, pro
            $table->enum('status', ['prospect', 'demo_sent', 'viewed', 'sold', 'active', 'suspended', 'cancelled'])->default('prospect');
            $table->string('domain')->nullable();
            $table->string('stripe_customer_id')->nullable();
            $table->string('stripe_subscription_id')->nullable();
            $table->integer('demo_views')->default(0);
            $table->timestamp('last_viewed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
