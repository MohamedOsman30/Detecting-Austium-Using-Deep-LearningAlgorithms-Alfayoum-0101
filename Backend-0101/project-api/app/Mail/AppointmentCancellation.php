<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;  // optional if queuing
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Appointment;

class AppointmentCancellation extends Mailable // implements ShouldQueue if you queue
{
    use Queueable, SerializesModels;

    public Appointment $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function build()
    {
        return $this->subject('Appointment Cancellation Notification')
                    ->view('emails.appointment_cancellation')
                    ->with([
                        'appointment' => $this->appointment // Changed variable name
                    ]);
    }

}
