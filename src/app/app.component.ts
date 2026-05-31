import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'MessagingUI';
  private msalService = inject(MsalService);
  private router = inject(Router);

  async ngOnInit() {
    console.log('Current URL:', window.location.href);
    await this.msalService.instance.initialize();

    const response =
      await this.msalService.instance.handleRedirectPromise();

    if (response?.account) {
      this.msalService.instance.setActiveAccount(
        response.account
      );
      this.router.navigate(['/chat']);
    }
  }

  async login() {
    alert("login button")
    try {
      const result = await this.msalService.instance.loginRedirect({
        scopes: ['openid', 'profile', 'email'],
        prompt: 'select_account'
      });

    } catch (error) {
      console.error(error);
    }
  }

  logout() {
    this.msalService.logoutPopup();
  }

  get account() {
    return this.msalService.instance.getActiveAccount();
  }
}
