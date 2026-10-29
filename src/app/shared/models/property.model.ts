/**
 * Supported types of rental properties.
 */
export type PropertyType =
  | 'Apartment'
  | 'Studio'
  | 'Room'
  | 'House';

/**
 * Defines the available lease duration options.
 */
export type LeaseType =
  | 'long-term'
  | 'short-term'
  | 'both';

/**
 * Defines how the rental price is presented.
 */
export type PriceMode =
  | 'per-month'
  | 'utilities-included';

/**
 * Represents a rental property listed on RentHub.
 */
export interface Property {
  /** Unique identifier for the property. */
  id: string;

  /** ID of the landlord who owns the listing. */
  ownerId: string;

  // Property information
  /** Title displayed for the property listing. */
  title: string;
  /** Description of the property and its features. */
  description: string;
  /** Category of the rental property. */
  propertyType: PropertyType;

  // Building and location details
  /** Name of the building or residential complex, if applicable. */
  buildingName?: string;
  /** Indicates whether the property is shared with other occupants. */
  sharedProperty?: boolean;
  /** Street address of the property, if provided. */
  streetAddress?: string;
  /** General location or area of the property. */
  location: string;
  /** Property area measured in square feet, if available. */
  squareFeet?: number;

  // Rental details
  /** Rental price for the property. */
  rent: number;
  /** Lease duration offered for the property. */
  leaseType?: LeaseType;
  /** Indicates whether the rent is negotiable. */
  negotiable?: boolean;
  /** Specifies whether the price is monthly or includes utilities. */
  priceMode?: PriceMode;

  // Rooms and preferences
  /** Number of bedrooms available. */
  bedrooms: number;
  /** Number of bathrooms available. */
  bathrooms: number;
  /** Indicates whether the property is furnished. */
  furnished: boolean;
  /** Vegetarian preference accepted by the property listing. */
  vegetarianPreference: 'yes' | 'no' | 'no-preference';

  // Listing information
  /** Amenities available at the property. */
  amenities: string[];
  /** Image URLs associated with the property listing. */
  photos: string[];

  // Landlord contact information
  /** Name of the landlord or contact person. */
  contactName: string;
  /** Email address for property-related inquiries. */
  contactEmail: string;
  /** Phone number for contacting the landlord. */
  contactPhone: string;

  /** Date and time when the property listing was created. */
  createdAt: string;
  /** Date and time when the property listing was last updated. */
  updatedAt: string;
}

/**
 * Represents a comment or reply posted on a property.
 */
export interface PropertyComment {
  /** Unique identifier for the comment. */
  id: string;
  /** ID of the property associated with the comment. */
  propertyId: string;
  /** ID of the user who wrote the comment. */
  authorId: string;
  /** Display name of the comment author. */
  authorName: string;
  /** Text content of the comment. */
  message: string;
  /** ID of the parent comment when this is a reply. */
  parentCommentId?: string;
  /** Date and time when the comment was created. */
  createdAt: string;
}

/**
 * Represents an inquiry sent by a tenant about a rental property.
 */
export interface PropertyInquiry {
  /** Unique identifier for the inquiry. */
  id: string;
  /** ID of the property the tenant is asking about. */
  propertyId: string;
  /** ID of the tenant who submitted the inquiry. */
  tenantId: string;
  /** ID of the landlord receiving the inquiry. */
  landlordId: string;
  /** Message or question submitted by the tenant. */
  message: string;
  /** Date and time when the inquiry was created. */
  createdAt: string;
  /** Current status of the inquiry. */
  status: 'pending' | 'responded' | 'closed';
}

/**
 * Represents a property saved to a tenant's favorites.
 */
export interface PropertyFavorite {
  /** Unique identifier for the favorite record. */
  id: string;
  /** ID of the favorited property. */
  propertyId: string;
  /** ID of the tenant who favorited the property. */
  tenantId: string;
  /** Date and time when the property was added to favorites. */
  createdAt: string;
}