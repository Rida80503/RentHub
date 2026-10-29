
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth.service';
import { PropertyService } from '../../../services/property.service';
import {
  LeaseType,
  Property,
  PropertyType,
} from '../../../shared/models/property.model';
import { User } from '../../../shared/models/user.model';

type ListingTab = 'all' | 'featured' | 'favourites';
type SortOption = 'newest' | 'rentLow' | 'rentHigh';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly propertyService = inject(PropertyService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly defaultPropertyImage =
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  properties: Property[] = [];
  featuredIndex = 0;

  activeTab: ListingTab = 'all';
  currentPage = 1;
  readonly pageSize = 6;

  searchLocation = '';
  minRent: number | null = null;
  maxRent: number | null = null;
  selectedType: PropertyType | '' = '';
  selectedBedrooms: number | '' = '';
  furnishedFilter: 'all' | 'furnished' | 'unfurnished' = 'all';
  vegetarianFilter: 'all' | 'yes' | 'no' | 'no-preference' = 'all';
  leaseFilter: 'all' | LeaseType = 'all';
  selectedAmenities: string[] = [];
  sortBy: SortOption = 'newest';

  // Profile popup state
  isProfileOpen = false;
  isEditingProfile = false;
  profileName = '';
  profileEmail = '';
  profilePhone = '';
  profileError = '';
  profileSuccess = '';

  readonly namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  readonly phonePattern = /^[6-9][0-9]{9}$/;

  readonly propertyTypes: PropertyType[] = [
    'Apartment',
    'Studio',
    'Room',
    'House',
  ];

  readonly bedroomOptions = [1, 2, 3, 4];

  readonly amenityOptions = [
    'Wi-Fi',
    'Parking',
    'Security',
    'Power Backup',
    'Gym',
    'Swimming Pool',
    'Garden',
    'Laundry',
    'Water Supply',
  ];

  ngOnInit(): void {
    this.loadProperties();
  }

  get currentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get dashboardRoute(): string {
    return this.currentUser?.role === 'landlord'
      ? '/landlord/dashboard'
      : '/';
  }

  get isProfileValid(): boolean {
    return (
      this.namePattern.test(this.profileName.trim()) &&
      this.emailPattern.test(this.profileEmail.trim()) &&
      this.phonePattern.test(this.profilePhone.trim())
    );
  }

  toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;

    if (this.isProfileOpen) {
      this.isEditingProfile = false;
      this.profileError = '';
      this.profileSuccess = '';

      const user = this.currentUser;

      if (user) {
        this.profileName = user.name;
        this.profileEmail = user.email;
        this.profilePhone = user.phone ?? '';
      }
    }
  }

  closeProfile(): void {
    this.isProfileOpen = false;
    this.isEditingProfile = false;
    this.profileError = '';
    this.profileSuccess = '';
  }

  startEditingProfile(): void {
    const user = this.currentUser;

    if (!user) {
      return;
    }

    this.profileName = user.name;
    this.profileEmail = user.email;
    this.profilePhone = user.phone ?? '';
    this.profileError = '';
    this.profileSuccess = '';
    this.isEditingProfile = true;
  }

  cancelEditingProfile(): void {
    const user = this.currentUser;

    if (user) {
      this.profileName = user.name;
      this.profileEmail = user.email;
      this.profilePhone = user.phone ?? '';
    }

    this.profileError = '';
    this.isEditingProfile = false;
  }

  saveProfile(): void {
    this.profileError = '';
    this.profileSuccess = '';

    const name = this.profileName.trim();
    const email = this.profileEmail.trim().toLowerCase();
    const phone = this.profilePhone.trim();

    if (!this.namePattern.test(name)) {
      this.profileError =
        'Name must contain English alphabets and spaces only.';
      return;
    }

    if (!this.emailPattern.test(email)) {
      this.profileError =
        'Enter a valid email, for example name@example.com.';
      return;
    }

    if (!this.phonePattern.test(phone)) {
      this.profileError =
        'Phone must be exactly 10 digits and start with 6, 7, 8 or 9.';
      return;
    }

    const updatedUser = this.authService.updateProfile({
      name,
      email,
      phone,
    });

    if (!updatedUser) {
      this.profileError =
        'Profile could not be updated. This email may already be registered.';
      return;
    }

    this.profileName = updatedUser.name;
    this.profileEmail = updatedUser.email;
    this.profilePhone = updatedUser.phone ?? '';
    this.isEditingProfile = false;
    this.profileSuccess = 'Profile updated successfully.';
  }

  get favouritesKey(): string {
    const user = this.currentUser;
    return user ? `renthub_favourites_${user.id}` : '';
  }

  private readFavouriteIds(): string[] {
    if (!this.favouritesKey) {
      return [];
    }

    try {
      const data = localStorage.getItem(this.favouritesKey);
      return data ? (JSON.parse(data) as string[]) : [];
    } catch {
      return [];
    }
  }

  private saveFavouriteIds(ids: string[]): void {
    if (this.favouritesKey) {
      localStorage.setItem(this.favouritesKey, JSON.stringify(ids));
    }
  }

  get favouriteIds(): string[] {
    return this.readFavouriteIds();
  }

  isFavourite(property: Property): boolean {
    return this.readFavouriteIds().includes(property.id);
  }

  toggleFavourite(property: Property): void {
    const user = this.currentUser;

    if (!user || user.role !== 'tenant') {
      window.alert(
        'Please log in with a tenant account to save favourite properties.',
      );

      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/' },
      });
      return;
    }

    const ids = this.readFavouriteIds();

    if (ids.includes(property.id)) {
      this.saveFavouriteIds(ids.filter(id => id !== property.id));
    } else {
      this.saveFavouriteIds([...ids, property.id]);
    }

    this.currentPage = 1;
  }

  loadProperties(): void {
    this.properties = this.propertyService.getProperties();
    this.featuredIndex = 0;
    this.currentPage = 1;
  }

  get featuredProperties(): Property[] {
    return this.properties.slice(0, 5);
  }

  get currentFeaturedProperty(): Property | null {
    return this.featuredProperties[this.featuredIndex] ?? null;
  }

  previousFeatured(): void {
    const count = this.featuredProperties.length;

    if (count > 0) {
      this.featuredIndex = (this.featuredIndex - 1 + count) % count;
    }
  }

  nextFeatured(): void {
    const count = this.featuredProperties.length;

    if (count > 0) {
      this.featuredIndex = (this.featuredIndex + 1) % count;
    }
  }

  get filteredProperties(): Property[] {
    const location = this.searchLocation.trim().toLowerCase();
    const favourites = this.readFavouriteIds();

    let results = this.properties.filter(property => {
      const matchesLocation =
        !location || property.location.toLowerCase().includes(location);

      const matchesMinRent =
        this.minRent === null || property.rent >= this.minRent;

      const matchesMaxRent =
        this.maxRent === null || property.rent <= this.maxRent;

      const matchesType =
        !this.selectedType || property.propertyType === this.selectedType;

      const matchesBedrooms =
        this.selectedBedrooms === '' ||
        property.bedrooms >= this.selectedBedrooms;

      const matchesFurnished =
        this.furnishedFilter === 'all' ||
        (this.furnishedFilter === 'furnished' && property.furnished) ||
        (this.furnishedFilter === 'unfurnished' && !property.furnished);

      const matchesVegetarian =
        this.vegetarianFilter === 'all' ||
        property.vegetarianPreference === this.vegetarianFilter;

      const matchesLease =
        this.leaseFilter === 'all' ||
        property.leaseType === this.leaseFilter ||
        property.leaseType === 'both';

      const matchesAmenities = this.selectedAmenities.every(amenity =>
        property.amenities.includes(amenity),
      );

      const matchesTab =
        this.activeTab === 'all' ||
        (this.activeTab === 'featured' &&
          this.featuredProperties.some(item => item.id === property.id)) ||
        (this.activeTab === 'favourites' &&
          favourites.includes(property.id));

      return (
        matchesLocation &&
        matchesMinRent &&
        matchesMaxRent &&
        matchesType &&
        matchesBedrooms &&
        matchesFurnished &&
        matchesVegetarian &&
        matchesLease &&
        matchesAmenities &&
        matchesTab
      );
    });

    results = [...results].sort((a, b) => {
      if (this.sortBy === 'rentLow') {
        return a.rent - b.rent;
      }

      if (this.sortBy === 'rentHigh') {
        return b.rent - a.rent;
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

    return results;
  }

  get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredProperties.length / this.pageSize),
    );
  }

  get paginatedProperties(): Property[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProperties.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get showingFrom(): number {
    return this.filteredProperties.length === 0
      ? 0
      : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredProperties.length,
    );
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
  }

  selectTab(tab: ListingTab): void {
    this.activeTab = tab;
    this.currentPage = 1;
  }

  resetPage(): void {
    this.currentPage = 1;
  }

  toggleAmenity(amenity: string, checked: boolean): void {
    if (checked && !this.selectedAmenities.includes(amenity)) {
      this.selectedAmenities = [...this.selectedAmenities, amenity];
    } else if (!checked) {
      this.selectedAmenities = this.selectedAmenities.filter(
        item => item !== amenity,
      );
    }

    this.resetPage();
  }

  isAmenitySelected(amenity: string): boolean {
    return this.selectedAmenities.includes(amenity);
  }

  clearFilters(): void {
    this.searchLocation = '';
    this.minRent = null;
    this.maxRent = null;
    this.selectedType = '';
    this.selectedBedrooms = '';
    this.furnishedFilter = 'all';
    this.vegetarianFilter = 'all';
    this.leaseFilter = 'all';
    this.selectedAmenities = [];
    this.sortBy = 'newest';
    this.activeTab = 'all';
    this.currentPage = 1;
  }

  getPropertyImage(property: Property): string {
    return property.photos?.[0] || this.defaultPropertyImage;
  }

  getOwner(property: Property): User | undefined {
    try {
      const data = localStorage.getItem('renthub_users');
      const users = data ? (JSON.parse(data) as User[]) : [];

      return users.find(user => user.id === property.ownerId);
    } catch {
      return undefined;
    }
  }

  viewProperty(property: Property): void {
    this.router.navigate(['/property-details'], {
      queryParams: { id: property.id },
    });
  }

  logout(): void {
    this.closeProfile();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
