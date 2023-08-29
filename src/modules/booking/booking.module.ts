import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './bookingschema';
import { EventModule } from 'src/modules/event/event.module';
import { EmailService } from './emailservice';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    EventModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingModule,EmailService,RabbitMQService],
})
export class BookingModule {}
