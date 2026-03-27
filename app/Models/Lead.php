<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lead extends Model
{
    protected $fillable = [
        'business_name', 'trade_type', 'category', 'contact_name', 'email', 'phone',
        'city', 'state', 'repo_name', 'demo_code', 'demo_url', 'github_url',
        'tier', 'status', 'domain', 'stripe_customer_id', 'stripe_subscription_id',
        'demo_views', 'last_viewed_at', 'notes',
    ];

    protected $casts = [
        'last_viewed_at' => 'datetime',
        'demo_views' => 'integer',
    ];

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public static function generateDemoCode(): string
    {
        do {
            $code = strtoupper(substr(str_shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ23456789'), 0, 6));
        } while (static::where('demo_code', $code)->exists());

        return $code;
    }

    public function log(string $action, array $details = []): ActivityLog
    {
        return $this->activityLogs()->create([
            'action' => $action,
            'details' => $details ?: null,
        ]);
    }

    public function isSold(): bool
    {
        return in_array($this->status, ['sold', 'active']);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function tierPrice(): ?array
    {
        return match($this->tier) {
            'starter' => ['setup' => 499, 'monthly' => 49],
            'growth'  => ['setup' => 999, 'monthly' => 79],
            'pro'     => ['setup' => 1999, 'monthly' => 149],
            default   => null,
        };
    }
}
