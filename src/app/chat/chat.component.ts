import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignalRServiceService } from '../signal-rservice.service';
import { CommonModule } from '@angular/common';

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
  messageReceived!: string;
  messageFrom!: string;
  ngOnInit(): void {
    this.chatForm = this.fb.group({
      sender: ['', Validators.required],
      receiver: ['', Validators.required],
      message: ['', Validators.required]
    });

    this.signalRService.startConnection();
    this.signalRService.messageSubject$.subscribe((v: { user: string, message: string }) => {
      this.messageFrom = v['user'];
      this.messageReceived = v['message'];
      console.log("data:" + JSON.stringify(v));
    });
  }

  sendMessage() {
    this.signalRService.sendPrivateMssage(this.chatForm.value.receiver, this.chatForm.value.message);
  }
}
