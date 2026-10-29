import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

/**
 * Test suite for the AuthService.
 *
 * Verifies service creation, user registration, duplicate email handling,
 * login, logout, and phone number validation.
 */
describe('AuthService', () => {
  let service: AuthService;

  /**
   * Runs before each test to initialize a clean testing environment.
   *
   * Clears localStorage, configures the testing module, and injects
   * the AuthService instance.
   */
  beforeEach(() => {
    // Clear stored data to prevent interference between tests.
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [AuthService],
    });

    // Retrieve the AuthService instance from Angular's dependency injection.
    service = TestBed.inject(AuthService);
  });

  /**
   * Runs after each test to remove stored data.
   */
  afterEach(() => {
    // Keep localStorage clean for subsequent tests.
    localStorage.clear();
  });

  /**
   * Checks whether the AuthService is created successfully.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Verifies that a new user can register with a valid phone number.
   *
   * Checks the registration result and confirms that the phone number
   * is saved in the stored user data.
   */
  it('should register a new user with a phone number', () => {
    const result = service.register(
      'Test User',
      'test@example.com',
      'Password@123',
      'tenant',
      '9876543210',
    );

    // Registration should succeed for a new user.
    expect(result).toBe(true);

    // Retrieve registered users from localStorage.
    const users = JSON.parse(
      localStorage.getItem('renthub_users') ?? '[]',
    );

    // Verify the user count and the registered phone number.
    expect(users.length).toBe(4);
    expect(users[3].phone).toBe('9876543210');
  });

  /**
   * Ensures that registration fails when an email already exists,
   * even if the email's letter casing differs.
   */
  it('should not register a duplicate email', () => {
    service.register(
      'Test User',
      'test@example.com',
      'Password@123',
      'tenant',
      '9876543210',
    );

    const result = service.register(
      'Another User',
      'TEST@example.com',
      'Password@456',
      'tenant',
      '9876543211',
    );

    // Duplicate email registration should fail.
    expect(result).toBe(false);
  });

  /**
   * Verifies that a registered user can log in with valid credentials.
   *
   * Also checks the login status and availability of the user's phone number.
   */
  it('should login with valid credentials', () => {
    service.register(
      'Test User',
      'test@example.com',
      'Password@123',
      'tenant',
      '9876543210',
    );

    // Authenticate the user and verify the resulting session state.
    expect(service.login('test@example.com', 'Password@123')).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.getCurrentUser()?.phone).toBe('9876543210');
  });

  /**
   * Ensures that login fails when the provided credentials are invalid.
   */
  it('should reject invalid credentials', () => {
    // Unknown email and incorrect password should not authenticate a user.
    expect(
      service.login('unknown@example.com', 'wrong-password'),
    ).toBe(false);
  });

  /**
   * Verifies that logging out ends the current user's session.
   */
  it('should logout the current user', () => {
    service.register(
      'Test User',
      'test@example.com',
      'Password@123',
      'tenant',
      '9876543210',
    );

    // Log in before testing the logout behavior.
    service.login('test@example.com', 'Password@123');
    service.logout();

    // Confirm that the user is no longer logged in.
    expect(service.isLoggedIn()).toBe(false);
  });

  /**
   * Ensures that registration fails when the phone number is invalid.
   */
  it('should reject an invalid phone number', () => {
    const result = service.register(
      'Test User',
      'invalid-phone@example.com',
      'Password@123',
      'tenant',
      '12345',
    );

    // An invalid phone number should prevent registration.
    expect(result).toBe(false);
  });
});