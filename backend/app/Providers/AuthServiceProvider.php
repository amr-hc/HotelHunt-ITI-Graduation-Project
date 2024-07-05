<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;


use App\Models\User;
use App\Policies\UserPolicy;

use App\Models\Hotel;
use App\Policies\HotelPolicy;

use App\Models\Booking;
use App\Policies\BookingPolicy;


class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
        User::class => UserPolicy::class,
        Hotel::class => HotelPolicy::class,
        Booking::class => BookingPolicy::class
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
        ResetPassword::createUrlUsing(function (User $user, string $token) {
            return 'http://localhost:4200/forget-password?token='.$token;
        });



        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            $new_url=str_replace(url('/api/verify'), 'http://localhost:4200/verify', $url);
            return (new MailMessage)
                ->subject('Verify Email Address')
                ->line('Click the button below to verify your email address.')
                ->action('Verify Email Address', $new_url);
        });

        Gate::define('isAdmin', function (User $user) {
            return $user->role == 'admin';
        });


    }
}
