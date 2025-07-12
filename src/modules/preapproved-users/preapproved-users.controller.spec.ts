import { Test, TestingModule } from '@nestjs/testing';

import { PreapprovedUsersController } from './preapproved-users.controller';

describe('PreapprovedUsersController', () => {
  let controller: PreapprovedUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreapprovedUsersController],
    }).compile();

    controller = module.get<PreapprovedUsersController>(
      PreapprovedUsersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
