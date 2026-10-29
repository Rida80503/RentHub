import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PropertyDetails } from './property-details';

/**
 * Unit tests for the PropertyDetails component.
 *
 * Verifies that the component is created successfully and that
 * no property is loaded when a property ID is not provided.
 */
describe('PropertyDetails', () => {
  let component: PropertyDetails;
  let fixture: ComponentFixture<PropertyDetails>;

  /**
   * Configures the Angular testing module before each test.
   * Imports the standalone component and provides an empty router
   * configuration for navigation dependencies.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyDetails],
      providers: [provideRouter([])],
    }).compileComponents();

    // Create the component instance and initialize change detection.
    fixture = TestBed.createComponent(PropertyDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Wait for pending asynchronous tasks to complete.
    await fixture.whenStable();
  });

  /**
   * Verifies that the component is created successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verifies that the property remains undefined when no property ID
   * is provided to the component.
   */
  it('should have no property when no property ID is provided', () => {
    expect(component.property).toBeUndefined();
  });
});