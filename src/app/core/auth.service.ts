import { Injectable } from '@angular/core';
import { User, UserRole } from '../shared/models/user.model';

/**
 * Represents a user stored in localStorage, including their password.
 */
interface StoredUser extends User {
  password: string;
}

/**
 * Provides authentication and user profile management for RentHub.
 *
 * Handles registration, login, logout, role verification, profile updates,
 * and initialization of demo landlord accounts using localStorage.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Keys used to store users, the current session, and demo-seeding status.
  private readonly usersKey = 'renthub_users';
  private readonly sessionKey = 'renthub_current_user';
  private readonly demoSeedKey = 'renthub_demo_landlords_seeded';

  /**
   * Initializes the service and seeds demo landlord accounts if necessary.
   */
  constructor() {
    this.seedDemoLandlords();
  }

  /**
   * Reads registered users from localStorage.
   *
   * @returns The stored users, or an empty array if data is missing
   * or cannot be parsed.
   */
  private readUsers(): StoredUser[] {
    try {
      const data = localStorage.getItem(this.usersKey);
      return data ? (JSON.parse(data) as StoredUser[]) : [];
    } catch {
      return [];
    }
  }

  /**
   * Saves the supplied user records to localStorage.
   *
   * @param users - The user records to save.
   */
  private saveUsers(users: StoredUser[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  /**
   * Seeds the three predefined demo landlord accounts.
   *
   * Existing accounts are not duplicated by ID or email address.
   */
  private seedDemoLandlords(): void {
    // Skip initialization if demo accounts have already been seeded.
    if (localStorage.getItem(this.demoSeedKey) === 'true') {
      return;
    }

    const users = this.readUsers();

    // Predefined landlord accounts for development and testing.
    const demoLandlords: StoredUser[] = [
      {
        id: 'demo-landlord-1',
        name: 'Demo Landlord 1',
        email: 'landlord1@renthub.demo',
        password: 'DemoLandlord@123',
        role: 'landlord',
        phone: '9000000001',
        createdAt: '2026-10-01T09:00:00.000Z',
      },
      {
        id: 'demo-landlord-2',
        name: 'Demo Landlord 2',
        email: 'landlord2@renthub.demo',
        password: 'DemoLandlord@123',
        role: 'landlord',
        phone: '9000000002',
        createdAt: '2026-10-02T09:00:00.000Z',
      },
      {
        id: 'demo-landlord-3',
        name: 'Demo Landlord 3',
        email: 'landlord3@renthub.demo',
        password: 'DemoLandlord@123',
        role: 'landlord',
        phone: '9000000003',
        createdAt: '2026-10-03T09:00:00.000Z',
      },
    ];

    // Add only accounts that do not already exist.
    for (const demoLandlord of demoLandlords) {
      const existingById = users.find(
        user => user.id === demoLandlord.id,
      );

      if (existingById) {
        continue;
      }

      const existingByEmail = users.find(
        user =>
          user.email.toLowerCase() ===
          demoLandlord.email.toLowerCase(),
      );

      if (existingByEmail) {
        continue;
      }

      users.push(demoLandlord);
    }

    // Persist the accounts and record that seeding is complete.
    this.saveUsers(users);
    localStorage.setItem(this.demoSeedKey, 'true');
  }

  /**
   * Registers a new user after validating the supplied information.
   *
   * @param name - The user's name.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @param role - The account role, either tenant or landlord.
   * @param phone - The user's Indian mobile number.
   * @returns True if registration succeeds; otherwise, false.
   */
  register(
    name: string,
    email: string,
    password: string,
    role: UserRole,
    phone: string,
  ): boolean {
    // Normalize user-provided values before validation.
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !password || !cleanPhone) {
      return false;
    }

    // Validate Indian mobile number.
    if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) {
      return false;
    }

    // Validate account role.
    if (role !== 'tenant' && role !== 'landlord') {
      return false;
    }

    const users = this.readUsers();

    // Prevent duplicate email registrations.
    if (
      users.some(
        user => user.email.toLowerCase() === cleanEmail,
      )
    ) {
      return false;
    }

    // Create the new user record with a unique ID and timestamp.
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: cleanName,
      email: cleanEmail,
      password,
      role,
      phone: cleanPhone,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);

    return true;
  }

  /**
   * Authenticates a user using their email address and password.
   *
   * @param email - The user's email address.
   * @param password - The supplied password.
   * @returns True if authentication succeeds; otherwise, false.
   */
  login(email: string, password: string): boolean {
    const cleanEmail = email.trim().toLowerCase();

    const user = this.readUsers().find(
      item =>
        item.email.toLowerCase() === cleanEmail &&
        item.password === password,
    );

    if (!user) {
      return false;
    }

    // Exclude the password from the current-user session.
    const { password: _password, ...publicUser } = user;

    // Store only public user information in the session.
    localStorage.setItem(
      this.sessionKey,
      JSON.stringify(publicUser),
    );

    return true;
  }

  /**
   * Retrieves the currently logged-in user's session information.
   *
   * @returns The current user, or null if no session exists or parsing fails.
   */
  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(this.sessionKey);
      return data ? (JSON.parse(data) as User) : null;
    } catch {
      return null;
    }
  }

  /**
   * Checks whether a user is currently logged in.
   *
   * @returns True if a current user exists; otherwise, false.
   */
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Checks whether the current user has the specified role.
   *
   * @param role - The role to check.
   * @returns True if the current user's role matches the supplied role.
   */
  hasRole(role: UserRole): boolean {
    return this.getCurrentUser()?.role === role;
  }

  /**
   * Updates the logged-in user's name, email and phone.
   *
   * The role, ID, password and account creation date are preserved.
   *
   * @param changes - The updated name, email address, and phone number.
   * @returns The updated public user object, or null if validation fails
   * or the user cannot be found.
   */
  updateProfile(
    changes: Pick<User, 'name' | 'email' | 'phone'>,
  ): User | null {
    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      return null;
    }

    // Normalize the updated profile values.
    const name = changes.name.trim();
    const email = changes.email.trim().toLowerCase();
    const phone = (changes.phone ?? '').trim();

    // Validate name.
    if (
      name.length < 2 ||
      name.length > 60 ||
      !/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(name)
    ) {
      return null;
    }

    // Validate email format.
    if (
      email.length > 254 ||
      !/^[a-zA-Z0-9_%+-]+(?:\.[a-zA-Z0-9_%+-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/.test(
        email,
      )
    ) {
      return null;
    }

    // Validate Indian mobile number.
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      return null;
    }

    const users = this.readUsers();

    // Prevent the email from being used by another account.
    const duplicateEmail = users.some(
      user =>
        user.id !== currentUser.id &&
        user.email.toLowerCase() === email,
    );

    if (duplicateEmail) {
      return null;
    }

    const userIndex = users.findIndex(
      user => user.id === currentUser.id,
    );

    if (userIndex === -1) {
      return null;
    }

    // Preserve existing account properties while updating profile fields.
    const updatedStoredUser: StoredUser = {
      ...users[userIndex],
      name,
      email,
      phone,
    };

    users[userIndex] = updatedStoredUser;
    this.saveUsers(users);

    // Update the session without storing the password.
    const {
      password: _password,
      ...publicUser
    } = updatedStoredUser;

    localStorage.setItem(
      this.sessionKey,
      JSON.stringify(publicUser),
    );

    return publicUser;
  }

  /**
   * Logs out the current user by removing their session from localStorage.
   */
  logout(): void {
    localStorage.removeItem(this.sessionKey);
  }
}