// import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { user, user_schema } from './users.schema';
import { Module } from '@nestjs/common';
import { AuthService } from 'src/belt/auth.service';
import { BasicAuthGuard } from 'src/belt/auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/middleware/jwts.trategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: user.name, schema: user_schema }]),
    JwtModule.register({
      secret: 'pooja',
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, BasicAuthGuard, JwtStrategy],
})
export class UsersModule {
  constructor() {
    console.log('This is user module');
  }
}
