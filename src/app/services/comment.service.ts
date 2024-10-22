import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'https://showmylife-back.vercel.app/api/articles'; // URL de base pour l'API

  constructor(private http: HttpClient) { }

  // Récupérer les commentaires pour un article donné
  getComments(articleId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/${articleId}/comments`);
  }

  // Créer un nouveau commentaire
  createComment(articleId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/${articleId}/comments`, comment);
  }

  // Supprimer un commentaire (nécessite la route appropriée)
  deleteComment(articleId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${articleId}/comments/${commentId}`);
  }
}
