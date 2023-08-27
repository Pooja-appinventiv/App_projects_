import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto_booking/booking_dto';
import { EventService } from 'src/modules/event/event.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Booking } from './bookingschema';
import { AuthGuard } from '@nestjs/passport';
import { EmailService } from './emailservice';
import * as cron from 'node-cron';
@ApiTags('bookings')
@Controller('booking')
export class BookingController {
 
  constructor(
    private readonly bookingservice: BookingService,
    private readonly eventservice: EventService,
    private readonly emailservice :EmailService
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
    const createdBooking=await this.bookingservice.createBooking(user_id, event_id);
    await this.emailservice.sendBookingConfirmation(email, event_name);
    return { message: 'Booking created successfully.' };
  }
  
  async sendEventReminders() {
    const upcomingEvents = await this.bookingservice.getUpcomingEventsWithinHour();
    for (const event of upcomingEvents) {
      await this.emailservice.sendEventReminder(event.user.email, event.name);
    }
  }
}