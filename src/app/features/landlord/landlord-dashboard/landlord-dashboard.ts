import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth.service';
import { PropertyService } from '../../../services/property.service';
import { Property } from '../../../shared/models/property.model';
import { User } from '../../../shared/models/user.model';

/**
 * Displays the landlord dashboard, manages the landlord's profile,
 * and provides property management actions.
 */
@Component({
  selector: 'app-landlord-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './landlord-dashboard.html',
  styleUrl: './landlord-dashboard.css'
})
export class LandlordDashboard implements OnInit {
  // Inject services used for authentication, property management, and navigation.
  private readonly authService = inject(AuthService);
  private readonly propertyService = inject(PropertyService);
  private readonly router = inject(Router);

  /** Stores the currently authenticated user. */
  currentUser: User | null = null;

  /** Stores the landlord's display name and owned properties. */
  landlordName = '';
  properties: Property[] = [];

  /** Stores dashboard errors and profile feedback messages. */
  errorMessage = '';
  profileError = '';
  profileMessage = '';

  // Controls the visibility and editing mode of the profile popup.
  isProfileOpen = false;
  isEditingProfile = false;

  /** Holds the profile form values while viewing or editing the profile. */
  profileName = '';
  profileEmail = '';
  profilePhone = '';

  /** Validation patterns for profile name, email address, and phone number. */
  readonly namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  readonly phonePattern = /^[6-9][0-9]{9}$/;

  /**
   * Initializes the dashboard after component creation.
   * Redirects unauthenticated users to login and users without the
   * landlord role to the home page.
   */
  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (user.role !== 'landlord') {
      this.router.navigate(['/']);
      return;
    }

    // Initialize the dashboard with the authenticated landlord's details.
    this.currentUser = user;
    this.landlordName = user.name;
    this.setProfileForm(user);
    this.loadProperties();
  }

  /**
   * Populates the profile form with the specified user's details.
   * Uses an empty string when the user has no phone number.
   */
  private setProfileForm(user: User): void {
    this.profileName = user.name;
    this.profileEmail = user.email;
    this.profilePhone = user.phone ?? '';
  }

  /** Returns the number of properties currently displayed on the dashboard. */
  get totalProperties(): number {
    return this.properties.length;
  }

  /** Checks whether the profile name matches the required pattern. */
  get isNameValid(): boolean {
    return this.namePattern.test(this.profileName.trim());
  }

  /** Checks whether the profile email matches the required pattern. */
  get isEmailValid(): boolean {
    return this.emailPattern.test(this.profileEmail.trim());
  }

  /** Checks whether the profile phone number matches the required pattern. */
  get isPhoneValid(): boolean {
    return this.phonePattern.test(this.profilePhone.trim());
  }

  /** Returns true only when all profile fields pass validation. */
  get isProfileValid(): boolean {
    return this.isNameValid && this.isEmailValid && this.isPhoneValid;
  }

  /**
   * Opens or closes the profile popup.
   * When opening, resets the form and clears previous feedback messages.
   */
  toggleProfile(): void {
    if (this.isProfileOpen) {
      this.closeProfile();
      return;
    }

    if (!this.currentUser) {
      return;
    }

    this.setProfileForm(this.currentUser);
    this.profileError = '';
    this.profileMessage = '';
    this.isEditingProfile = false;
    this.isProfileOpen = true;
  }

  /**
   * Closes the profile popup and resets its form to the current user details.
   */
  closeProfile(): void {
    this.isProfileOpen = false;
    this.isEditingProfile = false;
    this.profileError = '';
    this.profileMessage = '';

    if (this.currentUser) {
      this.setProfileForm(this.currentUser);
    }
  }

  /**
   * Enables profile editing and restores the current user's saved details.
   */
  startEditingProfile(): void {
    if (!this.currentUser) {
      return;
    }

    this.setProfileForm(this.currentUser);
    this.profileError = '';
    this.profileMessage = '';
    this.isEditingProfile = true;
  }

  /**
   * Cancels profile editing and discards unsaved form changes.
   */
  cancelEditingProfile(): void {
    if (this.currentUser) {
      this.setProfileForm(this.currentUser);
    }

    this.profileError = '';
    this.profileMessage = '';
    this.isEditingProfile = false;
  }

  /**
   * Validates the profile form and saves the updated details through AuthService.
   * Displays an error if validation fails or the profile update is unsuccessful.
   */
  saveProfile(): void {
    this.profileError = '';
    this.profileMessage = '';

    // Normalize form values before validation and saving.
    const name = this.profileName.trim();
    const email = this.profileEmail.trim().toLowerCase();
    const phone = this.profilePhone.trim();

    if (!this.namePattern.test(name)) {
      this.profileError =
        'Enter a valid name using English letters and spaces only.';
      return;
    }

    if (!this.emailPattern.test(email)) {
      this.profileError =
        'Enter a valid email address, for example name@example.com.';
      return;
    }

    if (!this.phonePattern.test(phone)) {
      this.profileError =
        'Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.';
      return;
    }

    // Attempt to update the authenticated user's profile.
    const updatedUser = this.authService.updateProfile({
      name,
      email,
      phone
    });

    if (!updatedUser) {
      this.profileError =
        'This email is already registered to another account, or the profile could not be updated.';
      return;
    }

    // Refresh the dashboard and form using the updated user details.
    this.currentUser = updatedUser;
    this.landlordName = updatedUser.name;
    this.setProfileForm(updatedUser);
    this.isEditingProfile = false;
    this.profileMessage = 'Profile updated successfully.';
  }

  /**
   * Loads properties owned by the currently authenticated landlord.
   * Clears the list if the current user is missing or has a different role.
   */
  loadProperties(): void {
    const user = this.authService.getCurrentUser();

    if (!user || user.role !== 'landlord') {
      this.properties = [];
      return;
    }

    this.properties = this.propertyService.getPropertiesByOwner(user.id);
  }

  /** Navigates to the form for adding a new property. */
  addProperty(): void {
    this.router.navigate(['/landlord/properties/new']);
  }

  /**
   * Navigates to the property details page for the selected property.
   * Passes the property ID as a query parameter.
   */
  viewProperty(property: Property): void {
    this.router.navigate(['/property-details'], {
      queryParams: { id: property.id }
    });
  }

  /**
   * Navigates to the edit page for the selected property.
   * Displays an error if the property ID is missing.
   */
  editProperty(property: Property): void {
    if (!property?.id) {
      this.errorMessage =
        'Property ID is missing. Please refresh the dashboard.';
      return;
    }

    this.router.navigate(['/landlord/properties/edit', property.id]);
  }

  /**
   * Requests confirmation before deleting a property.
   * Checks the current user's role, performs the deletion, and refreshes
   * the property list when the operation succeeds.
   */
  deleteProperty(property: Property): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${property.title}"?`
    );

    if (!confirmed) {
      return;
    }

    const user = this.authService.getCurrentUser();

    if (!user || user.role !== 'landlord') {
      this.errorMessage =
        'You are not authorized to delete this property.';
      return;
    }

    const deleted = this.propertyService.deleteProperty(
      property.id,
      user.id
    );

    if (deleted) {
      this.errorMessage = '';
      this.loadProperties();
    } else {
      this.errorMessage =
        'Property could not be deleted. Please refresh and try again.';
    }
  }

  /** Logs out the current user and redirects to the login page. */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}