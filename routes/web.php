<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LeadController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\StripeWebhookController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

// Public
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/demo', [PublicController::class, 'demo'])->name('demo');
Route::get('/demo/{code}', [PublicController::class, 'showDemo'])->name('demo.show');
Route::post('/api/demo/view/{code}', [PublicController::class, 'trackView'])->name('demo.track');

// Stripe webhook (no CSRF)
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle'])
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

// Admin system — login/auth via Breeze
Route::prefix('system')->name('system.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    });

    Route::middleware('auth')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/leads',            [LeadController::class, 'index'])->name('leads.index');
        Route::post('/leads',           [LeadController::class, 'store'])->name('leads.store');
        Route::get('/leads/{lead}',     [LeadController::class, 'show'])->name('leads.show');
        Route::put('/leads/{lead}',     [LeadController::class, 'update'])->name('leads.update');
        Route::get('/leads/{lead}/editor',       [LeadController::class, 'editor'])->name('leads.editor');
        Route::put('/leads/{lead}/site',         [LeadController::class, 'saveSite'])->name('leads.save-site');
        Route::get('/leads/{lead}/checkout-link',[LeadController::class, 'generateCheckoutLink'])->name('leads.checkout-link');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');

        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

        // Admin-only routes
        Route::middleware('admin')->group(function () {
            Route::get('/users',              [UserController::class, 'index'])->name('users.index');
            Route::get('/users/create',       [UserController::class, 'create'])->name('users.create');
            Route::post('/users',             [UserController::class, 'store'])->name('users.store');
            Route::get('/users/{user}/edit',  [UserController::class, 'edit'])->name('users.edit');
            Route::put('/users/{user}',       [UserController::class, 'update'])->name('users.update');
            Route::delete('/users/{user}',    [UserController::class, 'destroy'])->name('users.destroy');
        });
    });
});

require __DIR__.'/auth.php';
