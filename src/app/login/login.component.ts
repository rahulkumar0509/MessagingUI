import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { PublicClientApplication } from '@azure/msal-browser';
import { CommonModule } from '@angular/common';

export interface LoginResponse {
  accessToken: string;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private http: HttpClient = inject(HttpClient);
  private msalApp = inject(PublicClientApplication);

  // private router!: Router;
  loginForm!: FormGroup;
  fb = inject(FormBuilder);
  router = inject(Router);

  isLoggedIn = false;
  userName = '';

  msalLogin = true;

  async ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required]
    })
    await this.msalApp.initialize();
    const response = await this.msalApp.handleRedirectPromise();
    if (response) {
      this.msalApp.setActiveAccount(response.account);
    }
    this.checkAccount();
  }

  checkAccount() {
    const activeAccount = this.msalApp.getActiveAccount();
    if (activeAccount) {
      this.isLoggedIn = true;
      this.userName = activeAccount.name || '';
    }
  }

  async loginUser() {
    if (this.msalLogin) {
      try {
        const loginResponse = await this.msalApp.loginPopup({
          scopes: ['User.Read'] // Standard profile permission
        });
        this.msalApp.setActiveAccount(loginResponse.account);
        this.checkAccount();
      } catch (error) {
        console.error('Login failed:', error);
      }
      return;
    }

    let apirUrl = environment.messageApiUrl;
    this.http.get<LoginResponse>(`${apirUrl}/login?Email=${this.loginForm.value.email}`).pipe(catchError(this.handleError)).subscribe({
      next: (v) => {
        sessionStorage.setItem("accessToken", v.accessToken);
        sessionStorage.setItem("userEmail", this.loginForm.value.email);
        this.router.navigateByUrl("chat");
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  logout() {
    this.msalApp.logoutPopup();
    this.isLoggedIn = false;
  }

  handleError(err: HttpErrorResponse) {
    if (err.status == 401) {
      console.log("Unauthorized");
    }
    return throwError(() => new Error("something went wrong!"));
  }
  redirectToChat() {
    this.router.navigateByUrl("chat");
  }

  takeToHome() {
    this.router.navigateByUrl("");
  }

}
