import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { StorageService } from './storage.service'; // Importer le StorageService pour récupérer le token

const baseUrl = 'https://showmylife-back.vercel.app/api/users'; // Assurez-vous que l'URL est correcte

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private storageService: StorageService) {}

  // Créer des en-têtes HTTP avec le token
  private createHttpHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': token || '', // Ajoute le token ou une chaîne vide si absent
    });
  }

  // Récupérer tous les utilisateurs
  getUsers(): Observable<User[]> {
    const headers = this.createHttpHeaders();
    return this.http.get<User[]>(baseUrl, { headers });
  }

  // Récupérer un utilisateur par ID
  getUser(id: number): Observable<User> {
    const headers = this.createHttpHeaders();
    return this.http.get<User>(`${baseUrl}/${id}`, { headers });
  }


  // Mettre à jour un utilisateur par ID
  updateUser(id: number, data: User): Observable<User> {
    const headers = this.createHttpHeaders();
    return this.http.put<User>(`${baseUrl}/${id}`, data, { headers });
  }

  // Supprimer un utilisateur par ID
  deleteUser(id: number): Observable<any> {
    const headers = this.createHttpHeaders();
    return this.http.delete(`${baseUrl}/${id}`, { headers });
  }

  // Supprimer tous les utilisateurs
  deleteAllUsers(): Observable<any> {
    const headers = this.createHttpHeaders();
    return this.http.delete(baseUrl, { headers });
  }
}
