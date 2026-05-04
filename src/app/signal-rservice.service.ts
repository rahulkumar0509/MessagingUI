import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRServiceService {

  constructor() { }

  private hubConnection!: signalR.HubConnection;
  public messageSubject$ = new Subject<{user: string, message: string}>();

  public connectionID!: string;

  get connectionId(){
    return this.connectionID;
  }

  set connectionId(id: string){
    this.connectionID = id;
  }

  // Step 1: Initialize and Start Connection

  public startConnection = ()=>{
    // build connection
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5010/chat", {
        accessTokenFactory: ()=> sessionStorage.getItem("accessToken") || ""
      })
      .withAutomaticReconnect().build();
    this.addMessageListener();
    // start connection
    this.hubConnection.start().then(()=>{
      console.log("connection successfull!");
      this.connectionID = this.hubConnection.connectionId!;
    }).catch(err=>console.log("connection failed"));

  }

  // Step 2: Listen for server events:
  public addMessageListener = () => {
    this.hubConnection.on("ReceiveMessage", (user, message)=>{
      this.messageSubject$.next({user, message});
    });
    this.hubConnection.on("ReceivePrivateMessage", (user, message)=>{
      this.messageSubject$.next({user, message});
    });
  }

  // step 3: Send Message to server:
  public sendMessage = ((user: string, message: string)=>{
    this.hubConnection.invoke('SendMessage', user, message).catch(err=>console.log(err));
  })

  // Send Private message to another person
  public sendPrivateMssage = ((receiverId: string, message: string)=>{
    this.hubConnection.invoke('SendPrivateMessage', receiverId, sessionStorage.getItem("userEmail"), message).catch(err=>console.log(err));
  });
}
