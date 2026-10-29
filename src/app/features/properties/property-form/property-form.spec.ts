import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PropertyForm } from './property-form';
import { AuthService } from '../../../core/auth.service';
import { PropertyService } from '../../../services/property.service';

/**
 * Unit tests for the PropertyForm component.
 *
 * Verifies that the component is created successfully, that required
 * form controls exist, and that the form is invalid when required
 * fields are empty.
 */
describe('PropertyForm', () => {
  let component: PropertyForm;
  let fixture: ComponentFixture<PropertyForm>;

  /**
   * Configures the Angular testing module before each test.
   * Provides a mock authenticated landlord and mock property service
   * methods so the component can be tested independently.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyForm],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            // Simulate an authenticated landlord for the component.
            getCurrentUser: () => ({
              id: 'test-landlord',
              name: 'Test Landlord',
              email: 'landlord@example.com',
              phone: '9876543210',
              role: 'landlord',
            }),
          },
        },
        {
          provide: PropertyService,
          useValue: {
            // Mock property service methods to avoid external data operations.
            getPropertyById: () => undefined,
            addProperty: () => undefined,
            updateProperty: () => undefined,
          },
        },
      ],
    }).compileComponents();

    // Create the component instance and initialize its bindings.
    fixture = TestBed.createComponent(PropertyForm);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Wait for pending asynchronous tasks to complete.
    await fixture.whenStable();
  });

  /**
   * Verifies that the PropertyForm component is created successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verifies that the form contains the required title, rent,
   * and contact email controls.
   */
  it('should initialize the form with required controls', () => {
    expect(component.propertyForm.contains('title')).toBe(true);
    expect(component.propertyForm.contains('rent')).toBe(true);
    expect(component.propertyForm.contains('contactEmail')).toBe(true);
  });

  /**
   * Verifies that resetting the form makes it invalid when
   * required fields are empty.
   */
  it('should mark the form invalid when required fields are empty', () => {
    component.propertyForm.reset();
    expect(component.propertyForm.invalid).toBe(true);
  });
});