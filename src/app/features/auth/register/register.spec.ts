import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Register } from './register';

/**
 * Test suite for the Register component.
 *
 * Verifies that the registration component is created successfully
 * and that its form starts in an invalid state when empty.
 */
describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  /**
   * Configures the Angular testing module before each test.
   *
   * Imports the standalone Register component, provides the router,
   * creates the component fixture, and initializes change detection.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([])],
    }).compileComponents();

    // Create the component fixture and retrieve its instance.
    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;

    // Initialize change detection and wait for asynchronous tasks.
    fixture.detectChanges();
    await fixture.whenStable();
  });

  /**
   * Checks whether the Register component is created successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verifies that the registration form is invalid when all fields are empty.
   */
  it('should start with an invalid empty registration form', () => {
    expect(component.registerForm.invalid).toBe(true);
  });
});