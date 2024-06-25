import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserComment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://127.0.0.1:8000/api/comments/'

  constructor(private http: HttpClient) { }

  getAllComments(): Observable<any> {
    return this.http.get(this.apiUrl)
  }

  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(this.apiUrl + id)
  }

  createComment(userComment: UserComment): Observable<any> {
    return this.http.post(this.apiUrl, userComment)
  }
}
