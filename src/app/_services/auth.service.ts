import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

const AUTH_API = 'https://showmylife-back.vercel.app/api/auth/'; // URL de l'API d'authentification

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private storageService: StorageService) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      { username, password },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      { username, email, password },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  // Modification de logout pour nettoyer le sessionStorage
  logout(): void {
    this.storageService.clean(); // Effacez les données de l'utilisateur
  }

  private createHttpHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token || '',
    });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const token = this.storageService.getUser().accessToken;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token,
    });

    return this.http.put(AUTH_API + 'change-password', { currentPassword, newPassword }, { headers });
  }

  changeEmail(newEmail: string): Observable<any> {
    const token = this.storageService.getUser().accessToken;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token,
    });

    return this.http.put(AUTH_API + 'change-email', { email: newEmail }, { headers });
  }

  sendResetPasswordEmail(email: string): Observable<any> {
    return this.http.post(
        AUTH_API + 'request-password-reset',  // Utilisez la bonne route
        { email },
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
}




resetPassword(userId: string | null, token: string | null, newPassword: string): Observable<any> {
  const headers = new HttpHeaders({
      'Content-Type': 'application/json',
  });

  return this.http.put(`${AUTH_API}resetpassword`, {
      id: userId,    // Assurez-vous que userId n'est pas null
      token: token,   // Assurez-vous que token n'est pas null
      password: newPassword  // Le nouveau mot de passe
  }, { headers });
}

getCurrentUser(): any {
  return this.storageService.getUser();
}

// Vérifier si l'utilisateur est admin en fonction des données utilisateur
isAdmin(): boolean {
  const user = this.getCurrentUser();
  return user && user.roles && user.roles.includes('ROLE_ADMIN');
}
}

