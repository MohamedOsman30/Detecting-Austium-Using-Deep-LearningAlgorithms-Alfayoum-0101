<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Appointment;

class AppointmentConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment; // Make the appointment data public

    /**
     * Create a new message instance.
     *
     * @param Appointment $appointment
     */
    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        // Define the email content directly
        $content = "
            <h1>Appointment Confirmation</h1>
            <p>Dear {$this->appointment->name},</p>
            <p>Your appointment has been successfully booked. Here are the details:</p>
            <ul>
                <li><strong>Child's Name:</strong> {$this->appointment->child_name}</li>
                <li><strong>Gender:</strong> {$this->appointment->gender}</li>
                <li><strong>Email:</strong> {$this->appointment->email}</li>
                <li><strong>Phone:</strong> {$this->appointment->phone}</li>
                <li><strong>Age:</strong> {$this->appointment->age}</li>
                <li><strong>Doctor:</strong> {$this->appointment->doctorname}</li>
                <li><strong>Day:</strong> {$this->appointment->day}</li>
                <li><strong>Day:</strong> {$this->appointment->date}</li>
                <li><strong>Time:</strong> {$this->appointment->time}</li>
                <li><strong>History:</strong> " . ($this->appointment->history ?? 'No history provided') . "</li>
            </ul>
            <p>Thank you for choosing our service.</p>
        ";

        return $this->subject('Appointment Confirmation')
                    ->html($content);
    }
}