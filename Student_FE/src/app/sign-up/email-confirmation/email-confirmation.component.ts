import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Retrieve the userId and token from the query parameters
    this.route.queryParams.subscribe((queryParams) => {
      const userId = queryParams['userId'];
      const token = queryParams['token'];

      // Call your authentication service to confirm the email
      this.authService.confirmEmail(userId).subscribe((response) => {
        if (response.success) {
          // Email confirmed successfully, redirect to the login page
          this.router.navigate(['/Login']);
        } else {
          // Handle confirmation failure, e.g., display an error message
          // You can display an error message here or redirect to an error page
          this.router.navigate(['/EmailConfirmationError']);
        }
      });
    });
  }
}

