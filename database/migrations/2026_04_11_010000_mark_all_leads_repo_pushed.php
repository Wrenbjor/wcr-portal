<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('leads')->update(['repo_pushed' => true]);
    }

    public function down(): void
    {
        DB::table('leads')->update(['repo_pushed' => false]);
    }
};
