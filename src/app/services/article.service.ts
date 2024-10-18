import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';
import { environment } from '../../environments/environments';

const baseUrl = 'http://localhost:8080/api/articles';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  // Cloudinary configuration
  private cloudinaryUrl = 'https://api.cloudinary.com/v1_1/ddaxulsi7/image/upload'; // Remplace par ton Cloud Name
  private cloudinaryUploadPreset = 'my_upload_preset'; // Remplace par ton upload preset

  constructor(private http: HttpClient) {}

  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(baseUrl);
  }

  get(id: any): Observable<Article> {
    return this.http.get<Article>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<Article[]> {
    return this.http.get<Article[]>(`${baseUrl}?title=${title}`);
  }

  // File upload method to Cloudinary
  upload(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.cloudinaryUploadPreset); // Ajoute le preset

    // Create an HttpRequest for file upload
    return this.http.post(this.cloudinaryUrl, formData);
  }

  // Method to get all uploaded files
  getFiles(): Observable<any> {
    return this.http.get(`${baseUrl}/files`);
  }
}
