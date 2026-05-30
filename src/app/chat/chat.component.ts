import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignalRServiceService } from '../signal-rservice.service';
import { CommonModule } from '@angular/common';
import { catchError, debounceTime, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoginResponse } from '../login/login.component';
import { environment } from '../../environments/environment.prod';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  chatForm!: FormGroup;
  signalRService = inject(SignalRServiceService);
  fb = inject(FormBuilder);
  messageList: {from: string, message: string}[] = [];
  messageFrom!: string;
  receiverEmailValid = false;
  http = inject(HttpClient);
  userNotFound = false;
  router = inject(Router);

  ngOnInit(): void {
    this.chatForm = this.fb.group({
      sender: ['', Validators.required],
      receiver: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });

    this.signalRService.startConnection();
    this.signalRService.messageSubject$.subscribe((v: { user: string, message: string }) => {
      this.messageFrom = v['user'];
      this.messageList.push({from: 'received', message: v['message']});
      // console.log("data:" + JSON.stringify(v));
    });
  }

  sendMessage() {
    this.messageList.push({from: 'sent', message: this.chatForm.value.message});
    this.signalRService.sendPrivateMssage(this.chatForm.value.receiver, this.chatForm.value.message);
    this.chatForm.get('message')?.reset();
  }

  next() {
    if (this.chatForm.get('receiver')?.valid) {
      let apirUrl = environment.messageApiUrl;
      this.http.get(`${apirUrl}/verify/email?Email=${this.chatForm.value.receiver}`, {responseType: 'text'}).pipe(catchError(this.handleError)).subscribe({
            next: (v)=>{
              this.receiverEmailValid = true;
              this.userNotFound = false;
            },
            error: (e)=>{
              this.userNotFound = true;
              console.log(e);
            }
          })
    } else {
      this.receiverEmailValid = false;;
    }
  }

  handleError(err: HttpErrorResponse){
    if(err.status == 401){
      console.log("Unauthorized");
    }
    return throwError(()=> new Error("something went wrong!"));
  }

  takeToHome(){
    this.router.navigateByUrl("");
  }
}
