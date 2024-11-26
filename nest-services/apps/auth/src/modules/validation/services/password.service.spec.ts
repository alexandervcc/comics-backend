import { Test, TestingModule } from '@nestjs/testing';
import PasswordService from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword()', () => {
    it('should hash the password', async () => {
      const cleanPassword = 'password123';
      const hashedPassword = await service.hashPassword(cleanPassword);
      expect(hashedPassword).not.toBeUndefined();
      expect(hashedPassword).not.toEqual(cleanPassword);
    });
  });

  describe('validatePassword()', () => {
    it('should return true when passwords match', async () => {
      const cleanPassword = 'password123';
      const hashedPassword = await service.hashPassword(cleanPassword);
      const isMatch = await service.validatePassword(
        cleanPassword,
        hashedPassword,
      );
      expect(isMatch).toBe(true);
    });

    it('should return false when passwords do not match', async () => {
      const cleanPassword = 'password123';
      const otherPassword = 'differentPassword';
      const hashedPassword = await service.hashPassword(cleanPassword);
      const isMatch = await service.validatePassword(
        otherPassword,
        hashedPassword,
      );
      expect(isMatch).toBe(false);
    });
  });
});
