import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LandlordDashboard } from './landlord-dashboard';

/**
 * Provides a lightweight placeholder component for the login route
 * required by the dashboard's router configuration during testing.
 */
@Component({
  standalone: true,
  template: '',
})
class DummyLoginComponent {}

/**
 * Unit tests for the LandlordDashboard component.
 *
 * Verifies that the component can be created successfully and that
 * its properties list is initialized.
 */
describe('LandlordDashboard', () => {
  let component: LandlordDashboard;
  let fixture: ComponentFixture<LandlordDashboard>;

  /**
   * Configures the testing module before each test.
   *
   * Imports the standalone dashboard component, registers a dummy
   * login route, creates the component fixture, and waits for
   * initial change detection and asynchronous stability.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandlordDashboard],
      providers: [
        provideRouter([
          {
            path: 'login',
            component: DummyLoginComponent,
          },
        ]),
      ],
    }).compileComponents();

    // Create the dashboard component and access its instance.
    fixture = TestBed.createComponent(LandlordDashboard);
    component = fixture.componentInstance;

    // Trigger initial data binding and wait for pending asynchronous tasks.
    fixture.detectChanges();
    await fixture.whenStable();
  });

  /**
   * Checks whether the dashboard component is created successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Checks that the properties list exists and is an array.
   */
  it('should initialize the properties list', () => {
    expect(component.properties).toBeDefined();
    expect(Array.isArray(component.properties)).toBe(true);
  });
});