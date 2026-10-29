
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth.service';
import { PropertyService } from '../../../services/property.service';
import {
  LeaseType,
  PriceMode,
  Property,
  PropertyType
} from '../../../shared/models/property.model';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css'
})
export class PropertyForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly propertyService = inject(PropertyService);

  showPreview = false;
  isSubmitting = false;
  isEditMode = false;
  editLoadFailed = false;
  propertyId: string | null = null;

  errorMessage = '';
  successMessage = '';

  readonly defaultPropertyImage =
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  readonly amenityOptions = [
    'Wi-Fi',
    'Parking',
    'Air Conditioning',
    'Laundry',
    'Security',
    'Gym',
    'Lift',
    'Power Backup',
    'Balcony'
  ];

  // Shared form and validation rules for ADD and EDIT.
  propertyForm = this.fb.group({
    title: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        PropertyForm.hasLettersAndAllowedCharacters
      ]
    ],

    propertyType: ['Apartment' as PropertyType, Validators.required],

    streetAddress: [
      '',
      [
        Validators.required,
        Validators.maxLength(200),
        PropertyForm.hasLettersAndAllowedCharacters
      ]
    ],

    location: [
      '',
      [
        Validators.required,
        Validators.maxLength(100),
        PropertyForm.hasLettersAndAllowedCharacters
      ]
    ],

    squareFeet: [null as number | null, [Validators.min(1)]],
    sharedProperty: [false],

    rent: [
      null as number | null,
      [Validators.required, Validators.min(1)]
    ],

    leaseType: ['long-term' as LeaseType, Validators.required],
    priceMode: ['per-month' as PriceMode, Validators.required],
    negotiable: [false],

    bedrooms: [
      1,
      [Validators.required, Validators.min(0), Validators.max(50)]
    ],

    bathrooms: [
      1,
      [Validators.required, Validators.min(0), Validators.max(50)]
    ],

    furnished: [false],

    vegetarianPreference: [
      'no-preference' as 'yes' | 'no' | 'no-preference',
      Validators.required
    ],

    amenities: this.fb.group({
      'Wi-Fi': [false],
      Parking: [false],
      'Air Conditioning': [false],
      Laundry: [false],
      Security: [false],
      Gym: [false],
      Lift: [false],
      'Power Backup': [false],
      Balcony: [false]
    }),

    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(2000),
        PropertyForm.notWhitespaceOnly
      ]
    ],

    photosText: [''],

    // Email format: string@string.string
    contactEmail: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        )
      ]
    ],

    // Exactly 10 digits, starting with 6, 7, 8 or 9.
    contactPhone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[6-9][0-9]{9}$/)
      ]
    ],

    contactName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(80),
        Validators.pattern(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/)
      ]
    ]
  });

  get controls() {
    return this.propertyForm.controls;
  }

  get selectedAmenities(): string[] {
    const values = this.propertyForm.get('amenities')?.value as
      | Record<string, boolean>
      | null;

    if (!values) {
      return [];
    }

    return Object.keys(values).filter(key => values[key] === true);
  }

  get photoUrls(): string[] {
    return (this.controls.photosText.value ?? '')
      .split(/\r?\n/)
      .map(url => url.trim())
      .filter(url => url.length > 0);
  }

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    const routePath = this.route.snapshot.routeConfig?.path ?? '';

    this.propertyId = routeId;
    this.isEditMode = routePath.includes('edit') || Boolean(routeId);

    if (this.isEditMode) {
      if (!this.propertyId) {
        this.editLoadFailed = true;
        this.errorMessage =
          'Property ID is missing. Return to the dashboard and try Edit again.';
        return;
      }

      this.loadExistingProperty();
    }
  }

  private static hasLettersAndAllowedCharacters(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = String(control.value ?? '').trim();

    if (!value) {
      return { required: true };
    }

    if (!/^[A-Za-z0-9\s,.'/#&()-]+$/.test(value)) {
      return { invalidCharacters: true };
    }

    if (!/[A-Za-z]/.test(value)) {
      return { lettersRequired: true };
    }

    return null;
  }

  private static notWhitespaceOnly(
    control: AbstractControl
  ): ValidationErrors | null {
    return String(control.value ?? '').trim().length > 0
      ? null
      : { whitespace: true };
  }

  private loadExistingProperty(): void {
    const user = this.authService.getCurrentUser();

    if (!user || user.role !== 'landlord') {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.propertyId) {
      this.editLoadFailed = true;
      this.errorMessage = 'Property ID is missing.';
      return;
    }

    const property = this.propertyService.getPropertyById(this.propertyId);

    if (!property || property.ownerId !== user.id) {
      this.editLoadFailed = true;
      this.errorMessage =
        'Property not found or you are not authorized to edit it.';
      return;
    }

    const amenityValues: Record<string, boolean> = {};

    this.amenityOptions.forEach(amenity => {
      amenityValues[amenity] = property.amenities.includes(amenity);
    });

    // Existing data is loaded into the SAME validated form.
    this.propertyForm.patchValue({
      title: property.title,
      propertyType: property.propertyType,
      streetAddress: property.streetAddress ?? '',
      location: property.location,
      squareFeet: property.squareFeet ?? null,
      sharedProperty: property.sharedProperty ?? false,
      rent: property.rent,
      leaseType: property.leaseType ?? 'long-term',
      priceMode: property.priceMode ?? 'per-month',
      negotiable: property.negotiable ?? false,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      furnished: property.furnished,
      vegetarianPreference: property.vegetarianPreference,
      amenities: amenityValues,
      description: property.description,
      photosText: property.photos.join('\n'),
      contactName: property.contactName,
      contactEmail: property.contactEmail,
      contactPhone: property.contactPhone
    });

    this.propertyForm.updateValueAndValidity();
  }

  private arePhotoUrlsValid(): boolean {
    return this.photoUrls.every(value => {
      try {
        const url = new URL(value);

        return (
          (url.protocol === 'http:' || url.protocol === 'https:') &&
          Boolean(url.hostname) &&
          url.hostname.includes('.')
        );
      } catch {
        return false;
      }
    });
  }

  arePhotoUrlsValidForDisplay(): boolean {
    return this.arePhotoUrlsValid();
  }

  private validateBeforeContinuing(): boolean {
    this.propertyForm.markAllAsTouched();
    this.propertyForm.updateValueAndValidity();

    if (this.propertyForm.invalid) {
      this.errorMessage =
        'Please correct all highlighted fields before continuing.';
      return false;
    }

    if (!this.arePhotoUrlsValid()) {
      this.controls.photosText.markAsTouched();
      this.errorMessage =
        'Enter valid HTTP or HTTPS photo URLs, one per line.';
      return false;
    }

    return true;
  }

  previewProperty(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isSubmitting || this.editLoadFailed) {
      return;
    }

    // Both ADD and EDIT use the same validation.
    if (!this.validateBeforeContinuing()) {
      this.showPreview = false;
      return;
    }

    this.showPreview = true;

    setTimeout(() => {
      document.getElementById('listing-preview')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 0);
  }

  editDetails(): void {
    this.showPreview = false;
    this.errorMessage = '';

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  cancelForm(): void {
    this.router.navigate(['/landlord/dashboard']);
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isSubmitting) {
      return;
    }

    if (!this.showPreview) {
      this.errorMessage = 'Please preview your listing before submitting.';
      return;
    }

    if (this.editLoadFailed) {
      this.errorMessage =
        'The existing property could not be loaded. Nothing was saved.';
      return;
    }

    // Validate everything again before saving.
    if (!this.validateBeforeContinuing()) {
      this.showPreview = false;
      return;
    }

    const user = this.authService.getCurrentUser();

    if (!user || user.role !== 'landlord') {
      this.errorMessage = 'Please sign in with a landlord account.';
      return;
    }

    const value = this.propertyForm.getRawValue();

    const propertyData: Omit<
      Property,
      'id' | 'createdAt' | 'updatedAt'
    > = {
      ownerId: user.id,
      title: String(value.title ?? '').trim(),
      description: String(value.description ?? '').trim(),
      propertyType: value.propertyType as PropertyType,
      streetAddress: String(value.streetAddress ?? '').trim(),
      location: String(value.location ?? '').trim(),
      squareFeet: value.squareFeet ? Number(value.squareFeet) : undefined,
      sharedProperty: Boolean(value.sharedProperty),
      rent: Number(value.rent),
      leaseType: value.leaseType as LeaseType,
      negotiable: Boolean(value.negotiable),
      priceMode: value.priceMode as PriceMode,
      bedrooms: Number(value.bedrooms),
      bathrooms: Number(value.bathrooms),
      furnished: Boolean(value.furnished),
      vegetarianPreference: value.vegetarianPreference as
        | 'yes'
        | 'no'
        | 'no-preference',
      amenities: this.selectedAmenities,
      photos: this.photoUrls,
      contactName: String(value.contactName ?? '').trim(),
      contactEmail: String(value.contactEmail ?? '').trim(),
      contactPhone: String(value.contactPhone ?? '').trim()
    };

    this.isSubmitting = true;

    try {
      if (this.isEditMode) {
        if (!this.propertyId) {
          this.errorMessage =
            'Property ID is missing. No new property was created.';
          return;
        }

        const { ownerId: _ownerId, ...changes } = propertyData;

        const updated = this.propertyService.updateProperty(
          this.propertyId,
          user.id,
          changes
        );

        if (!updated) {
          this.errorMessage =
            'Property update failed. No new listing was created.';
          return;
        }
      } else {
        this.propertyService.addProperty(propertyData);
      }

      this.router.navigate(['/landlord/dashboard']);
    } catch (error) {
      console.error('Could not save property:', error);
      this.errorMessage = 'Could not save the property. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
