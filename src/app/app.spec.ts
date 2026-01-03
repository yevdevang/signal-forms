import { describe, it, beforeEach, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { App } from './app';

describe('App - Login Form Flow Tests', () => {
  let fixture: ComponentFixture<App>;
  let component: App;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should have submit button disabled initially', () => {
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    expect(component.isFormValid()).toBe(false);
  });

  it('should show validation errors and enable submit when form is valid', async () => {
    const emailInput = compiled.querySelector('#email') as HTMLInputElement;
    const passwordInput = compiled.querySelector('#password') as HTMLInputElement;
    const confirmPasswordInput = compiled.querySelector('#confirmPassword') as HTMLInputElement;
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    // Enter invalid email
    emailInput.focus();
    emailInput.value = 'invalid';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput.blur();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.textContent).toContain('Please enter a valid email address');
    expect(submitButton.disabled).toBe(true);

    // Enter valid email
    emailInput.value = 'test@example.com';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    // Enter invalid password
    passwordInput.focus();
    passwordInput.value = 'short';
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    passwordInput.blur();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.textContent).toContain('Password must be at least 8 characters');
    expect(submitButton.disabled).toBe(true);

    // Enter valid password
    passwordInput.value = 'Password123!';
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    // Enter non-matching confirm password
    confirmPasswordInput.focus();
    confirmPasswordInput.value = 'Different123!';
    confirmPasswordInput.dispatchEvent(new Event('input', { bubbles: true }));
    confirmPasswordInput.blur();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(compiled.textContent).toContain('Passwords do not match');
    expect(submitButton.disabled).toBe(true);

    // Enter matching confirm password
    confirmPasswordInput.value = 'Password123!';
    confirmPasswordInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.isFormValid()).toBe(true);
    expect(submitButton.disabled).toBe(false);
  });

  it('should submit form and reset fields on successful submission', () => {
    const emailInput = compiled.querySelector('#email') as HTMLInputElement;
    const passwordInput = compiled.querySelector('#password') as HTMLInputElement;
    const confirmPasswordInput = compiled.querySelector('#confirmPassword') as HTMLInputElement;
    const form = compiled.querySelector('form') as HTMLFormElement;
    const consoleSpy = vi.spyOn(console, 'log');

    // Fill form with valid data
    emailInput.value = 'user@example.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'Password123!';
    passwordInput.dispatchEvent(new Event('input'));
    confirmPasswordInput.value = 'Password123!';
    confirmPasswordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Submit form
    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);
    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
      email: 'user@example.com',
      password: '***'
    });
    expect(component.loginModel().email).toBe('');
    expect(component.loginModel().password).toBe('');
    expect(component.loginModel().confirmPassword).toBe('');

    consoleSpy.mockRestore();
  });

  it('should not show validation errors immediately after successful submission', () => {
    const emailInput = compiled.querySelector('#email') as HTMLInputElement;
    const passwordInput = compiled.querySelector('#password') as HTMLInputElement;
    const confirmPasswordInput = compiled.querySelector('#confirmPassword') as HTMLInputElement;
    const form = compiled.querySelector('form') as HTMLFormElement;

    // Fill form with valid data
    emailInput.value = 'user@example.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'Password123!';
    passwordInput.dispatchEvent(new Event('input'));
    confirmPasswordInput.value = 'Password123!';
    confirmPasswordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Submit form
    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);
    fixture.detectChanges();

    // Verify form is reset
    expect(component.loginModel().email).toBe('');
    
    // Verify no validation errors are shown despite fields being touched and empty
    expect(compiled.textContent).not.toContain('Email is required');
    expect(compiled.textContent).not.toContain('Password is required');
    expect(compiled.textContent).not.toContain('Please confirm your password');
  });
});
