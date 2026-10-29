import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';

/**
 * Test suite for the Login component.
 *
 * Verifies that the component initializes successfully and that
 * the login form starts in an invalid state when empty.
 */
describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  /**
   * Configures the Angular testing module before each test.
   *
   * Imports the standalone Login component, provides an empty router,
   * creates the component fixture, and initializes change detection.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    // Create the component instance and its test fixture.
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;

    // Initialize the component and wait for pending asynchronous tasks.
    fixture.detectChanges();
    await fixture.whenStable();
  });

  /**
   * Checks whether the Login component is created successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verifies that the login form is invalid when all fields are empty.
   */
  it('should start with an invalid empty login form', () => {
    expect(component.loginForm.invalid).toBe(true);
  });
});