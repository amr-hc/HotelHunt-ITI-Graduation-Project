<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

ResetPassword::createUrlUsing(function (User $user, string $token) {
    try {
        $url = 'http://localhost:4200/reset-password?token=' . $token;
        return $url;
    } catch (Exception $e) {
        // Log the error message and stack trace
        Log::error('Failed to generate reset password URL: ' . $e->getMessage(), [
            'exception' => $e
        ]);
        // Optionally, return a default or error URL
        return 'http://localhost:4200/error?message=URL%20generation%20failed';
    }
});



        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            $new_url=str_replace(url('/api/verify'), 'http://localhost:4200/verify', $url);
            return (new MailMessage)
                ->subject('Verify Email Address')
                ->line('Click the button below to verify your email address.')
                ->action('Verify Email Address', $new_url);
        });

    }
}
