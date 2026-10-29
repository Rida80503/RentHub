
import { Injectable } from '@angular/core';
import { Property, PropertyComment } from '../shared/models/property.model';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private readonly propertiesKey = 'renthub_properties';
  private readonly seedKey = 'renthub_demo_properties_seeded';
  private readonly commentsKey = 'renthub_property_comments';

  // Each default image has a different property photo.
  private readonly defaultPropertyImages: string[] = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80&auto=compress',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=75',
  ];

  private readProperties(): Property[] {
    try {
      const data = localStorage.getItem(this.propertiesKey);
      if (!data) {
        return [];
      }

      const properties = JSON.parse(data) as Property[];

      if (!Array.isArray(properties)) {
        return [];
      }

      // Give existing properties a saved default photo if they have none.
      const changed = this.ensureDefaultPhotos(properties);

      if (changed) {
        this.saveProperties(properties);
      }

      return properties;
    } catch (error) {
      console.error('Could not read RentHub properties:', error);
      return [];
    }
  }

  private saveProperties(properties: Property[]): void {
    localStorage.setItem(this.propertiesKey, JSON.stringify(properties));
  }

  /**
   * Assigns a default photo only when a property has no photo.
   * Existing manually supplied photos are preserved.
   */
  private ensureDefaultPhotos(properties: Property[]): boolean {
    let changed = false;
    const usedPhotos = new Set<string>();

    for (const property of properties) {
      if (!Array.isArray(property.photos)) {
        property.photos = [];
      }

      property.photos = property.photos.filter(
        photo => typeof photo === 'string' && photo.trim().length > 0,
      );

      if (property.photos.length === 0) {
        property.photos = [
          this.pickDefaultPhoto(property.id, usedPhotos),
        ];
        changed = true;
      }

      property.photos.forEach(photo => usedPhotos.add(photo));
    }

    return changed;
  }

  /**
   * Selects an unused default image when possible.
   * The chosen URL is saved on the property, so it remains stable.
   */
  private pickDefaultPhoto(
    propertyId: string,
    usedPhotos: Set<string>,
  ): string {
    const availablePhoto = this.defaultPropertyImages.find(
      photo => !usedPhotos.has(photo),
    );

    if (availablePhoto) {
      usedPhotos.add(availablePhoto);
      return availablePhoto;
    }

    // Fallback if all default images are already in use.
    let hash = 0;

    for (let index = 0; index < propertyId.length; index++) {
      hash = (hash * 31 + propertyId.charCodeAt(index)) >>> 0;
    }

    const fallback =
      this.defaultPropertyImages[
        hash % this.defaultPropertyImages.length
      ];

    usedPhotos.add(fallback);
    return fallback;
  }

  private readComments(): PropertyComment[] {
    try {
      const data = localStorage.getItem(this.commentsKey);
      return data ? (JSON.parse(data) as PropertyComment[]) : [];
    } catch {
      return [];
    }
  }

  private saveComments(comments: PropertyComment[]): void {
    localStorage.setItem(this.commentsKey, JSON.stringify(comments));
  }

  constructor() {
    this.seedDemoProperties();
  }

  private seedDemoProperties(): void {
    if (localStorage.getItem(this.seedKey) === 'true') {
      return;
    }

    const existingProperties = this.readProperties();

    const demoProperties: Property[] = [
      {
        id: 'demo-property-1',
        ownerId: 'demo-landlord-1',
        title: 'Modern Furnished Apartment',
        description:
          'A bright, comfortable apartment with modern interiors and easy access to public transport.',
        propertyType: 'Apartment',
        location: 'Sector 62, Noida',
        rent: 18000,
        bedrooms: 2,
        bathrooms: 2,
        furnished: true,
        vegetarianPreference: 'no-preference',
        amenities: ['Wi-Fi', 'Parking', 'Security'],
        photos: [],
        contactName: 'Demo Landlord',
        contactEmail: 'landlord1@renthub.demo',
        contactPhone: '9000000001',
        createdAt: '2026-10-01T09:00:00.000Z',
        updatedAt: '2026-10-01T09:00:00.000Z',
      },
      {
        id: 'demo-property-2',
        ownerId: 'demo-landlord-1',
        title: 'Affordable Studio Home',
        description:
          'A compact studio designed for students and working professionals.',
        propertyType: 'Studio',
        location: 'Sector 18, Noida',
        rent: 10000,
        bedrooms: 1,
        bathrooms: 1,
        furnished: true,
        vegetarianPreference: 'no-preference',
        amenities: ['Wi-Fi', 'Power Backup'],
        photos: [],
        contactName: 'Demo Landlord',
        contactEmail: 'landlord1@renthub.demo',
        contactPhone: '9000000001',
        createdAt: '2026-10-02T09:00:00.000Z',
        updatedAt: '2026-10-02T09:00:00.000Z',
      },
      {
        id: 'demo-property-3',
        ownerId: 'demo-landlord-2',
        title: 'Spacious Family House',
        description:
          'A spacious home with nearby markets, schools and convenient transport connections.',
        propertyType: 'House',
        location: 'Sector 50, Noida',
        rent: 28000,
        bedrooms: 3,
        bathrooms: 2,
        furnished: false,
        vegetarianPreference: 'no-preference',
        amenities: ['Parking', 'Garden', 'Security'],
        photos: [],
        contactName: 'Demo Landlord 2',
        contactEmail: 'landlord2@renthub.demo',
        contactPhone: '9000000002',
        createdAt: '2026-10-03T09:00:00.000Z',
        updatedAt: '2026-10-03T09:00:00.000Z',
      },
      {
        id: 'demo-property-4',
        ownerId: 'demo-landlord-2',
        title: 'Private Room for Professionals',
        description:
          'A private room in a residential area with access to essential amenities.',
        propertyType: 'Room',
        location: 'Sector 63, Noida',
        rent: 7500,
        bedrooms: 1,
        bathrooms: 1,
        furnished: true,
        vegetarianPreference: 'yes',
        amenities: ['Wi-Fi', 'Laundry', 'Security'],
        photos: [],
        contactName: 'Demo Landlord 2',
        contactEmail: 'landlord2@renthub.demo',
        contactPhone: '9000000002',
        createdAt: '2026-10-04T09:00:00.000Z',
        updatedAt: '2026-10-04T09:00:00.000Z',
      },
      {
        id: 'demo-property-5',
        ownerId: 'demo-landlord-3',
        title: 'Premium Furnished Apartment',
        description:
          'A well-maintained apartment with comfortable interiors and convenient local facilities.',
        propertyType: 'Apartment',
        location: 'Sector 137, Noida',
        rent: 22000,
        bedrooms: 2,
        bathrooms: 2,
        furnished: true,
        vegetarianPreference: 'no-preference',
        amenities: ['Gym', 'Swimming Pool', 'Parking'],
        photos: [],
        contactName: 'Demo Landlord 3',
        contactEmail: 'landlord3@renthub.demo',
        contactPhone: '9000000003',
        createdAt: '2026-10-05T09:00:00.000Z',
        updatedAt: '2026-10-05T09:00:00.000Z',
      },
      {
        id: 'demo-property-6',
        ownerId: 'demo-landlord-3',
        title: 'Budget-Friendly Independent Room',
        description:
          'A simple and practical rental option for someone looking for an affordable place.',
        propertyType: 'Room',
        location: 'Sector 15, Noida',
        rent: 6000,
        bedrooms: 1,
        bathrooms: 1,
        furnished: false,
        vegetarianPreference: 'no',
        amenities: ['Water Supply', 'Security'],
        photos: [],
        contactName: 'Demo Landlord 3',
        contactEmail: 'landlord3@renthub.demo',
        contactPhone: '9000000003',
        createdAt: '2026-10-06T09:00:00.000Z',
        updatedAt: '2026-10-06T09:00:00.000Z',
      },
    ];

    const existingIds = new Set(
      existingProperties.map(property => property.id),
    );

    const propertiesToAdd = demoProperties.filter(
      property => !existingIds.has(property.id),
    );

    const allProperties = [...propertiesToAdd, ...existingProperties];

    this.ensureDefaultPhotos(allProperties);
    this.saveProperties(allProperties);

    localStorage.setItem(this.seedKey, 'true');
  }

  getProperties(): Property[] {
    return this.readProperties();
  }

  getPropertiesByOwner(ownerId: string): Property[] {
    return this.readProperties().filter(
      property => property.ownerId === ownerId,
    );
  }

  getPropertyById(id: string): Property | undefined {
    return this.readProperties().find(property => property.id === id);
  }

  addProperty(
    propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>,
  ): Property {
    const properties = this.readProperties();
    const now = new Date().toISOString();

    const newProperty: Property = {
      ...propertyData,
      photos: Array.isArray(propertyData.photos)
        ? [...propertyData.photos].filter(photo => photo.trim().length > 0)
        : [],
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    if (newProperty.photos.length === 0) {
      const usedPhotos = new Set(
        properties.flatMap(property => property.photos ?? []),
      );

      newProperty.photos = [
        this.pickDefaultPhoto(newProperty.id, usedPhotos),
      ];
    }

    properties.unshift(newProperty);
    this.saveProperties(properties);

    return newProperty;
  }

  updateProperty(
    id: string,
    ownerId: string,
    changes: Partial<Omit<Property, 'id' | 'ownerId' | 'createdAt'>>,
  ): boolean {
    const properties = this.readProperties();

    const index = properties.findIndex(
      property => property.id === id && property.ownerId === ownerId,
    );

    if (index === -1) {
      return false;
    }

    const updatedProperty: Property = {
      ...properties[index],
      ...changes,
      id,
      ownerId,
      createdAt: properties[index].createdAt,
      updatedAt: new Date().toISOString(),
    };

    if (!Array.isArray(updatedProperty.photos) ||
        updatedProperty.photos.filter(photo => photo.trim().length > 0).length === 0) {
      const usedPhotos = new Set(
        properties
          .filter(property => property.id !== id)
          .flatMap(property => property.photos ?? []),
      );

      updatedProperty.photos = [
        this.pickDefaultPhoto(id, usedPhotos),
      ];
    } else {
      updatedProperty.photos = updatedProperty.photos.filter(
        photo => photo.trim().length > 0,
      );
    }

    properties[index] = updatedProperty;
    this.saveProperties(properties);

    return true;
  }

  deleteProperty(id: string, ownerId: string): boolean {
    const properties = this.readProperties();

    const property = properties.find(
      item => item.id === id && item.ownerId === ownerId,
    );

    if (!property) {
      return false;
    }

    this.saveProperties(properties.filter(item => item.id !== id));
    return true;
  }

  // Discussion: get messages for one property only.
  getComments(propertyId: string): PropertyComment[] {
    return this.readComments()
      .filter(comment => comment.propertyId === propertyId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime(),
      );
  }

  // Add a message or a reply to an existing message.
  addComment(
    commentData: Omit<PropertyComment, 'id' | 'createdAt'>,
  ): PropertyComment {
    const comments = this.readComments();

    const newComment: PropertyComment = {
      ...commentData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);
    this.saveComments(comments);

    return newComment;
  }
}
