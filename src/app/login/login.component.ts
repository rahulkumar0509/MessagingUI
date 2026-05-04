import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

interface LoginResponse{
  accessToken: string;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  private http: HttpClient = inject(HttpClient);
  // private router!: Router;
  loginForm!: FormGroup;
  fb = inject(FormBuilder);
  router = inject(Router);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required]
    })
  }

  loginUser(){
    // new HttpHeaders({
    //   'Authorization': 'Bearer ' + localStorage.getItem
    // })
    this.http.get<LoginResponse>(`http://localhost:5010/login?Email=${this.loginForm.value.email}&Password=pass`).pipe(catchError(this.handleError)).subscribe({
      next: (v)=>{
        sessionStorage.setItem("accessToken", v.accessToken);
        sessionStorage.setItem("userEmail", this.loginForm.value.email);
        this.router.navigateByUrl("chat");
      },
      error: (e)=>{
        console.log(e);
      }
    })
  }

  handleError(err: HttpErrorResponse){
    if(err.status == 401){
      console.log("Unauthorized");
      // this.router.navigateByUrl("")

    }
    return throwError(()=> new Error("something went wrong!"));
  }
  redirectToChat(){
    this.router.navigateByUrl("chat");
  }
}
