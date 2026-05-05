import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{

  singupForm!: FormGroup;
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);

  ngOnInit(): void {
    this.singupForm = this.fb.group({
      email: ["", Validators.required],
      phone: ["", Validators.required],
      name: ["", Validators.required],
      age: ["", Validators.required],
      sex: ["", Validators.required],
    })
  }

  Signup(){
    console.log(JSON.stringify(this.singupForm.value));
    let apirUrl = environment.messageApiUrl;
    this.http.post(`${apirUrl}/signup`, this.singupForm.value).subscribe({
      next: (v)=>{
        this.router.navigateByUrl("login");
      }, error: (e)=>{
        console.log(e);
      }
    });
  }

  login(){
    this.router.navigateByUrl("login");
  }

  handleError(err: HttpErrorResponse){
    if(err.status == 401){
      console.log("Unauthorized");
      // this.router.navigateByUrl("")
      this.router.navigateByUrl("login");
    }
    return throwError(()=> new Error("something went wrong!"));
  }
}
