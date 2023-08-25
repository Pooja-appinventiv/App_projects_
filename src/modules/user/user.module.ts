import { Module } from '@nestjs/common';
import { user, user_schema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/middleware/jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { EventSchema } from 'src/modules/event/eventschema';
import { AuthService } from 'src/basic_auth/basic.auth.guard';
import { BasicAuthGuard } from 'src/basic_auth/basic.auth.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: user.name, schema: user_schema },
      { name: Event.name, schema: EventSchema },
    ]),

    JwtModule.register({
      secret: 'pooja',
      signOptions: { expiresIn: '1h' },
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          auth: {
            user: 'poojantech11@gmail.com',
            pass: 'hddntnesorjapeog',
          },
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy,AuthService, BasicAuthGuard,],
})
export class UserModule {
  constructor() {
    console.log('This is user module');
  }
}
