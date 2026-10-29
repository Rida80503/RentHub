import { TestBed } from '@angular/core/testing';
import { PropertyService } from './property.service';

/**
 * Unit tests for PropertyService.
 * These tests verify service creation and property retrieval methods.
 */
describe('PropertyService', () => {
  let service: PropertyService;

  /**
   * Clears local storage and initializes the service
   * before each test to provide a clean testing environment.
   */
  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [PropertyService],
    });

    // Retrieve the PropertyService instance from Angular's testing injector.
    service = TestBed.inject(PropertyService);
  });

  /**
   * Clears local storage after each test to prevent
   * stored data from affecting subsequent tests.
   */
  afterEach(() => {
    localStorage.clear();
  });

  /**
   * Verifies that PropertyService is successfully created.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Verifies that the service loads demo properties
   * and returns them as a non-empty array.
   */
  it('should load demo properties', () => {
    const properties = service.getProperties();

    expect(Array.isArray(properties)).toBe(true);
    expect(properties.length).toBeGreaterThan(0);
  });

  /**
   * Verifies that a property can be retrieved using its ID.
   */
  it('should return a property by its ID', () => {
    const properties = service.getProperties();
    const firstProperty = properties[0];

    expect(service.getPropertyById(firstProperty.id)).toEqual(firstProperty);
  });

  /**
   * Verifies that getPropertiesByOwner returns only properties
   * belonging to the specified owner.
   */
  it('should return properties for the specified owner', () => {
    const properties = service.getProperties();
    const ownerId = properties[0].ownerId;

    const ownerProperties = service.getPropertiesByOwner(ownerId);

    expect(ownerProperties.length).toBeGreaterThan(0);
    expect(ownerProperties.every(p => p.ownerId === ownerId)).toBe(true);
  });

  /**
   * Verifies that an unknown property ID returns undefined.
   */
  it('should return undefined for an unknown property ID', () => {
    expect(service.getPropertyById('unknown-property-id')).toBeUndefined();
  });
});