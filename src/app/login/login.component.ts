import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';

export interface LoginResponse {
  accessToken: string;
}

@Component({
  selector: 'app-login',
  standalone: true, // Ensuring it's marked standalone explicitly for Angular 18
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private http: HttpClient = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private msalService = inject(MsalService);

  loginForm!: FormGroup;
  isLoggedIn = false;
  userName = '';
  msalLogin = true;

  async ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required]
    });
  }

  login() {
    this.msalService.instance.loginRedirect({
      scopes: ['openid', 'profile', 'email']
    });
  }

  
  async loginUser() {

    // Custom API login below...
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

  handleError(err: HttpErrorResponse) {
    if (err.status === 401) {
      console.log("Unauthorized");
    }
    return throwError(() => new Error("Something went wrong!"));
  }

  redirectToChat() {
    this.router.navigateByUrl("chat");
  }

  takeToHome() {
    this.router.navigateByUrl("");
  }
}