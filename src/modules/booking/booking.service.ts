import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import * as cron from 'node-cron';
import { Booking } from './bookingschema';
import { InjectModel } from '@nestjs/mongoose';
import { EventService } from 'src/modules/event/event.service';
@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: mongoose.Model<Booking>,
    private readonly eventservice: EventService,
  ) { }

  async getAllBookings(): Promise<Booking[]> {
    return this.bookingModel.find();
  }
  async createBooking(userid: string, eventid: string): Promise<void> {
    const booking = new this.bookingModel({
      user: userid,
      event: eventid,
    });

    await booking.save();
    await this.eventservice.updateEventAttendees(eventid, userid);
  }
  async getUpcomingEventsWithinHour(): Promise<any> {
    const currentTime = new Date();
    const oneHourLater = new Date(currentTime.getTime() + 60 * 60 * 1000); 

    const upcomingEvents = await this.bookingModel
      .find({
        'event.start_time': { $gt: currentTime, $lt: oneHourLater },
      })

    return upcomingEvents.map(booking => booking.event);
  }
}
