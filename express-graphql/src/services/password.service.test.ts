import PasswordService from "./password.service";

describe("PasswordService", () => {
  let passwordService: PasswordService;

  beforeEach(() => {
    passwordService = new PasswordService();
  });

  describe("hashPassword()", () => {
    it("should hash the password", async () => {
      const cleanPassword = "password123";
      const hashedPassword = await passwordService.hashPassword(cleanPassword);
      expect(hashedPassword).not.toBeUndefined();
      expect(hashedPassword).not.toEqual(cleanPassword);
    });
  });

  describe("validatePassword()", () => {
    it("should return true when passwords match", async () => {
      const cleanPassword = "password123";
      const hashedPassword = await passwordService.hashPassword(cleanPassword);
      const isMatch = await passwordService.validatePassword(
        cleanPassword,
        hashedPassword
      );
      expect(isMatch).toBe(true);
    });

    it("should return false when passwords do not match", async () => {
      const cleanPassword = "password123";
      const otherPassword = "differentPassword";
      const hashedPassword = await passwordService.hashPassword(cleanPassword);
      const isMatch = await passwordService.validatePassword(
        otherPassword,
        hashedPassword
      );
      expect(isMatch).toBe(false);
    });
  });
});
