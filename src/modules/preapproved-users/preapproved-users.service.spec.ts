import { Test, TestingModule } from '@nestjs/testing';

import { PreapprovedUsersService } from './preapproved-users.service';

describe('PreapprovedUsersService', () => {
  let service: PreapprovedUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreapprovedUsersService],
    }).compile();

    service = module.get<PreapprovedUsersService>(PreapprovedUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
