<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'wrenbjor@gmail.com'],
            [
                'name'     => 'Wren',
                'password' => bcrypt('changeme123'),
            ]
        );

        $this->call(LeadSeeder::class);
    }
}
