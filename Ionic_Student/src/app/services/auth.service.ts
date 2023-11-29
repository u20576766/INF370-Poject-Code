import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RegisterUserViewModel } from '../shared/register';
import { LoginUserViewModel } from '../shared/login';
import { SendTwoFactorTokenViewModel, VerifyTwoFactorTokenViewModel } from '../shared/2fatoken';
import { ConfirmEmailViewModel } from '../shared/confirm-email';
import { ForgotPasswordViewModel, ResetPasswordViewModel } from '../shared/forget-password';
import { UpdateAccountModel, UpdatePasswordModel } from '../shared/account';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  studentID: string = '';
  private authenticated: boolean = false;
  authStatus = new EventEmitter<boolean>();
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  apiUrl = 'https://localhost:7121/api/Account'; // Replace with your API URL

  constructor(private httpClient: HttpClient) { }
 // Helper function to get the JWT token from local storage
 private getToken(): string | null {
  return localStorage.getItem('token');
}

// Helper function to get the user ID from local storage
getStudentID(): string | null {
  return localStorage.getItem('studentId');
}

// Add a method to check if the user is authenticated
isAuthenticated(): boolean {
  const token = this.getToken();
  return !!token; // Returns true if the token exists, indicating the user is authenticated
}

  // Helper function to create HTTP headers with the Authorization header
  private createAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

  // Add a method to perform registration
  register(user: RegisterUserViewModel): Observable<any> {
    // Make an HTTP POST request to your registration endpoint on the backend
    return this.httpClient.post<any>(`${this.apiUrl}/register`, user);
  }

  // Modify the login method
  login(credentials: LoginUserViewModel): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response: { token: string; studentID: string; firstName: string; lastName: string; email: string; phonenumber: string; }) => {
          console.log('Response from API:', response);

          // Store the JWT token and user data in local storage
          localStorage.setItem('token', response.token);
          localStorage.setItem('studentId', response.studentID);
          localStorage.setItem('firstName', response.firstName);
          localStorage.setItem('lastName', response.lastName);
          localStorage.setItem('email', response.email);
          localStorage.setItem('cell_Number', response.phonenumber);

          this.updateAuthenticationStatus(true);

           // Update the authentication status to true
         this.isAuthenticatedSubject.next(true);
        })
      );
  }

  // Modify the logout method
  logout(): void {
    // Clear the JWT token and user data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('studentId');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('cell_Number');

    this.updateAuthenticationStatus(false);
  }

  // Add a method to update the authentication status
  private updateAuthenticationStatus(status: boolean): void {
    localStorage.setItem('authenticated', status.toString());
  }


  // Add a method for sending a Two-Factor Authentication token
  sendTwoFactorAuthenticationToken(model: SendTwoFactorTokenViewModel): Observable<any> {
    const headers = this.createAuthHeaders(); // Include Authorization header
    return this.httpClient.post<any>(`${this.apiUrl}/send-2fa-token`, model, { headers });
  }

  // Add a method for verifying and enabling Two-Factor Authentication
  verifyAndEnableTwoFactorAuthentication(model: VerifyTwoFactorTokenViewModel): Observable<any> {
    const headers = this.createAuthHeaders(); // Include Authorization header
    return this.httpClient.post<any>(`${this.apiUrl}/verify-2fa`, model, { headers });
  }
// Update the method for resetting the password
resetPassword(email: string, twoFactorToken: string, model: ResetPasswordViewModel): Observable<any> {
  const headers = this.createAuthHeaders(); // Include Authorization header

  // Construct the URL with query parameters
  const url = `${this.apiUrl}/reset-password?email=${encodeURIComponent(email)}&twoFactorToken=${encodeURIComponent(twoFactorToken)}`;

  return this.httpClient.post<any>(url, model, { headers });
}

  // Add a method for sending a password reset request
  forgotPassword(model: ForgotPasswordViewModel): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/forgot-password`, model);
  }

  // Add a method for creating a JWT
  createJWT(user: any): Observable<any> {
    const headers = this.createAuthHeaders(); // Include Authorization header
    return this.httpClient.get<any>(`${this.apiUrl}/create-jwt`, { headers, params: user });
  }

  // Add a method for confirming email
  confirmEmail(model: ConfirmEmailViewModel): Observable<any> {
    const headers = this.createAuthHeaders(); // Include Authorization header
    return this.httpClient.put<any>(`${this.apiUrl}/confirm-email`, model, { headers });
  }

  // Add a method for updating account details
  updateAccount(studentId: number, model: UpdateAccountModel): Observable<any> {
    const headers = this.createAuthHeaders(); // Include Authorization header
    const url = `${this.apiUrl}/update-account?studentId=${studentId}`; // Include studentId as a query parameter
    return this.httpClient.post<any>(url, model, { headers });
  }

  // Add a method for updating account details
  updatePassword(studentId: number, model: UpdatePasswordModel): Observable<any> {
    const headers = this.createAuthHeaders(); // Include Authorization header
    const url = `${this.apiUrl}/update-password?studentId=${studentId}`; // Include studentId as a query parameter
    return this.httpClient.post<any>(url, model, { headers });
  }

  

  // Add a method for viewing account details
  viewAccount(): Observable<any> {
    const headers = this.createAuthHeaders(); // Include Authorization header
    return this.httpClient.get<any>(`${this.apiUrl}/view-account`, { headers });
  }

  // Add a method for deleting the account
  deleteAccount(): Observable<any> {
    const headers = this.createAuthHeaders(); // Include Authorization header
    return this.httpClient.post<any>(`${this.apiUrl}/delete-account`, {}, { headers });
  }





}
