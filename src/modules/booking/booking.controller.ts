import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto_booking/booking_dto';
import { EventService } from 'src/modules/event/event.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Booking } from './bookingschema';
import { AuthGuard } from '@nestjs/passport';
import { EmailService } from './emailservice';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import * as cron from 'node-cron';
import { PDFDocument } from 'pdf-lib';
import { UserService } from '../user/user.service';
@ApiTags('bookings')
@Controller('booking')
export class BookingController {
 
  constructor(
    private readonly bookingservice: BookingService,
    private readonly eventservice: EventService,
    private readonly emailservice :EmailService,
    private readonly rabbitmqservice :RabbitMQService,
  ) { cron.schedule('0 * * * *', () => this.sendEventReminders());}
  
  @UseGuards(AuthGuard('basic'))
  @Get('/getall')
  @ApiResponse({
    status: 200,
    description: 'List of all bookings',
    type: Booking,
    isArray: true,
  })
  async getAllBookings() {
    const bookings = await this.bookingservice.getAllBookings();
    return { bookings };
  }

  //creating booking for user for an event using the event id and user id
  @Post('/userbooking')
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({
    status: 200,
    description: 'event created by admin successfully',
    type: String,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    const { user_id, event_id,email, event_name } = createBookingDto;
    const data=await this.bookingservice.createBooking(user_id, event_id);
    console.log(data)
    const queueName = 'booking_queue';
    const bookingData = JSON.stringify(data);
  
    // Establish RabbitMQ connection and send booking data to queue
    await this.rabbitmqservice.connect();
    await this.rabbitmqservice.sendToQueue(queueName, bookingData);
    console.log('Data is sent to queue successfully');
    //sending confirmation by email to user
    await this.emailservice.sendBookingConfirmation(email, event_name);


    //extraction of data from the queue
    const channel = this.rabbitmqservice.getChannel();
    await channel.assertQueue(queueName);
    channel.consume(queueName, async (message) => {
      if (message) {
        const bookingData = JSON.parse(message.content.toString());
        console.log(bookingData)

        // Assuming you have a method to convert bookingData to PDF
        const pdfBuffer = await this.bookingservice.convertBookingDataToPDF(bookingData);
        console.log(pdfBuffer);

        // Send PDF to user's email using NodeMailer
        await this.emailservice.sendBookingPDF(email, pdfBuffer);

        channel.ack(message);
      }
    });


    return { message: 'Booking created successfully.' };
  }
  
  async sendEventReminders() {
    const upcomingEvents = await this.bookingservice.getUpcomingEventsWithinHour();
    for (const event of upcomingEvents) {
      await this.emailservice.sendEventReminder(event.user.email, event.name);
    }
  }
}