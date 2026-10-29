import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

/**
 * Unit tests for the root App component.
 */
describe('App', () => {
  /**
   * Configures the Angular testing module before each test.
   * Imports the standalone App component and provides an empty router.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  /**
   * Verifies that the App component is created successfully.
   */
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  /**
   * Verifies that the root template contains the router outlet
   * used to display components for the active route.
   */
  it('should render the router outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('router-outlet')).not.toBeNull();
  });
});