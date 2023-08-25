import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer'; // Import only MailerService

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendBookingConfirmation(userEmail: string, eventName: string): Promise<void> {
    const mailOptions = {
      to: userEmail,
      subject: 'Booking Confirmation',
      text: `Dear user, you have successfully booked the event: ${eventName},at ${Event}.`

    };
    await this.mailerService.sendMail(mailOptions);
  }
  async sendEventReminder(userEmail: string, eventName: string): Promise<void> {
    const mailOptions = {
      from: 'your@email.com',
      to: userEmail,
      subject: 'Event Reminder',
      html: `<p>Dear user,</p>
             <p>Just a reminder that the event "${eventName}" is about to start soon.</p>
             <p>Event details: ...</p>`,
    };
  }
}