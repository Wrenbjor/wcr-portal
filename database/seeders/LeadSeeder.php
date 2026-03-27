<?php

namespace Database\Seeders;

use App\Models\Lead;
use Illuminate\Database\Seeder;

class LeadSeeder extends Seeder
{
    private string $githubOwner = 'Wrenbjor';

    public function run(): void
    {
        $this->importFile(
            '/Users/wren/code/_template/sites_data.json',
            'trades'
        );
        $this->importFile(
            '/Users/wren/code/_template/lawyers_data.json',
            'lawyers'
        );
        $this->importFile(
            '/Users/wren/code/_template/small_biz_data.json',
            'smb'
        );
    }

    private function importFile(string $path, string $category): void
    {
        $data = json_decode(file_get_contents($path), true);

        foreach ($data as $item) {
            $repoName  = $this->repoNameFor($category, $item['repo_name']);
            $githubUrl = "https://github.com/{$this->githubOwner}/{$repoName}";
            $demoUrl   = "https://raw.githack.com/{$this->githubOwner}/{$repoName}/main/index.html";

            Lead::firstOrCreate(
                ['repo_name' => $repoName],
                [
                    'business_name' => $item['business_name'],
                    'trade_type'    => $item['trade_type'] ?? 'General',
                    'category'      => $category,
                    'phone'         => $item['phone'] ?? null,
                    'city'          => $item['city'] ?? 'Cherry Hill',
                    'state'         => $item['state'] ?? 'NJ',
                    'demo_code'     => Lead::generateDemoCode(),
                    'demo_url'      => $demoUrl,
                    'github_url'    => $githubUrl,
                    'status'        => 'prospect',
                ]
            );
        }
    }

    private function repoNameFor(string $category, string $slug): string
    {
        return match($category) {
            'trades'  => str_starts_with($slug, 'trades--') ? $slug : "trades--{$slug}",
            'lawyers' => str_starts_with($slug, 'lawyers--') ? $slug : "lawyers--{$slug}",
            'smb'     => str_starts_with($slug, 'smb--') ? $slug : "smb--{$slug}",
            default   => $slug,
        };
    }
}
