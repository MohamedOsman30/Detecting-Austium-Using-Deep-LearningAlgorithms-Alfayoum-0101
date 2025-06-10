<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class PasswordResetOtp extends Notification
{
    use Queueable;

    public $otp;

    public function __construct($otp)
    {
        $this->otp = $otp;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Your Password Reset OTP')
                    ->line('Your OTP for password reset is: **' . $this->otp . '**')
                    ->line('This OTP will expire in 60 minutes.')
                    ->line('If you did not request this, please ignore this email.');
    }
}