import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { EventBusService } from './_shared/event-bus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  username?: string;

  eventBusSub?: Subscription;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.setInitialTheme();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      if (user) {
        this.roles = user.roles || [];
        this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
        this.username = user.username;
      } else {
        console.error("L'utilisateur est undefined ou n'a pas de rôles.");
      }
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  logout(): void {
    console.log('Tentative de déconnexion...');
    this.authService.logout();
    window.location.reload();
  }

  goBack(): void {
    window.history.back();
  }

  toggleDarkTheme(): void {
    document.body.classList.toggle('dark-theme');
  }

  setInitialTheme(): void {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    document.body.classList.toggle('dark-theme', prefersDarkScheme.matches);
  }

  isDarkThemeActive(): boolean {
    return document.body.classList.contains('dark-theme');
  }
}
