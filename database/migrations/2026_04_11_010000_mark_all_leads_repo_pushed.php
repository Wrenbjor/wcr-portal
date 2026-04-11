<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add the column first
        if (!Schema::hasColumn('leads', 'repo_pushed')) {
            Schema::table('leads', function (Blueprint $table) {
                $table->boolean('repo_pushed')->default(false)->after('demo_views');
            });
        }

        // Mark all leads as pushed since all repos are now live
        DB::table('leads')->update(['repo_pushed' => true]);
    }

    public function down(): void
    {
        if (Schema::hasColumn('leads', 'repo_pushed')) {
            Schema::table('leads', function (Blueprint $table) {
                $table->dropColumn('repo_pushed');
            });
        }
    }
};
