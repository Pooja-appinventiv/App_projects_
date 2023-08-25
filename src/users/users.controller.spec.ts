import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';
// import { JwtAuthGuard } from 'src/middleware/jwt-auth.guard';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [JwtAuthGuard],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
