import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
// import { BeltGuard } from './belt/belt.guard';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://poojaa:123@cluster0.pf0tywt.mongodb.net/nest_db',
    ),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('This is app module');
  }
}
