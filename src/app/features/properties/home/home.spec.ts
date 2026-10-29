import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';

/**
 * Unit tests for the Home component.
 *
 * Verifies that the component is created successfully and that
 * the properties list is initialized as an array.
 */
describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  /**
   * Configures the Angular testing module before each test.
   * Imports the standalone Home component and provides router
   * dependencies required by the component.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    // Create the component instance and initialize change detection.
    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Wait for pending asynchronous tasks to complete.
    await fixture.whenStable();
  });

  /**
   * Verifies that the Home component is created successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verifies that the properties list is defined and is an array.
   */
  it('should initialize the properties list', () => {
    expect(component.properties).toBeDefined();
    expect(Array.isArray(component.properties)).toBe(true);
  });
});