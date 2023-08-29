import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './modules/event/event.module';
import { BookingModule } from './modules/booking/booking.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import path from 'path';
import {
  AcceptLanguageResolver,
  I18nJsonLoader,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { RabbitMQService } from './modules/rabbitmq/rabbitmq.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://poojaa:123@cluster0.pf0tywt.mongodb.net/virtual_event_db',
    ),
    UserModule,
    AdminModule,
    EventModule,
    BookingModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 200000,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: '/home/admin96/Videos/appinventive_projects/virtual_event_management_system/App_projects_/src/i18n/',
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    })
  ],
  controllers: [AppController],
  providers: [AppService,RabbitMQService],
})
export class AppModule {
  constructor() {
    console.log('This is app module');
    
  }
}
