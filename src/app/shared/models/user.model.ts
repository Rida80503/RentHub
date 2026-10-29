/**
 * Defines the roles available to users on RentHub.
 */
export type UserRole = 'tenant' | 'landlord';

/**
 * Represents a registered user in the RentHub application.
 */
export interface User {
  /** Unique identifier assigned to the user. */
  id: string;

  /** Full name of the user. */
  name: string;

  /** Email address used to identify and contact the user. */
  email: string;

  /** Role that determines the user's access and functionality. */
  role: UserRole;

  /** User's contact phone number, if provided. */
  phone?: string;

  /** Date and time when the user account was created. */
  createdAt: string;
}