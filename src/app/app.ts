import { Component, signal, computed } from '@angular/core';
import { form, Field, required, email, minLength, pattern } from '@angular/forms/signals';

interface LoginFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-root',
  imports: [Field],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Track if form was just reset to prevent showing errors immediately after submission
  private formJustReset = signal(false);
  
  // Model signal for form data
  loginModel = signal<LoginFormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Create form with validators
  loginForm = form(this.loginModel, (schemaPath) => {
    // Email validation
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Please enter a valid email address' });

    // Password validation
    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters' });
    pattern(
      schemaPath.password,
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
      { message: 'Password must contain at least one capital letter and one special symbol' }
    );

    // Confirm Password validation
    required(schemaPath.confirmPassword, { message: 'Please confirm your password' });
  });

  // Check if passwords match
  passwordsMatch = computed(() => {
    const password = this.loginForm.password().value();
    const confirmPassword = this.loginForm.confirmPassword().value();
    return password === confirmPassword && password !== '';
  });

  // Computed signal for form validity
  isFormValid = computed(() => {
    return (
      this.loginForm.email().valid() &&
      this.loginForm.password().valid() &&
      this.loginForm.confirmPassword().valid() &&
      this.passwordsMatch()
    );
  });

  // Computed signal to show errors (only if form wasn't just reset)
  showEmailErrors = computed(() => 
    this.loginForm.email().touched() && 
    this.loginForm.email().invalid() && 
    !this.formJustReset()
  );
  
  showPasswordErrors = computed(() =>
    this.loginForm.password().touched() && 
    this.loginForm.password().invalid() && 
    !this.formJustReset()
  );
  
  showConfirmPasswordErrors = computed(() =>
    this.loginForm.confirmPassword().touched() && 
    this.loginForm.confirmPassword().invalid() && 
    !this.formJustReset()
  );

  // Submit handler
  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (this.isFormValid()) {
      const formData = this.loginModel();
      console.log('Form submitted:', {
        email: formData.email,
        password: '***' // Don't log actual password
      });
      
      // Reset form after successful submission
      // Set flag to prevent showing errors immediately
      this.formJustReset.set(true);
      
      // Reset model values
      this.loginModel.set({
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Clear the flag after fields are interacted with again
      // This happens automatically when user starts typing
      setTimeout(() => this.formJustReset.set(false), 100);
    }
  }
}
