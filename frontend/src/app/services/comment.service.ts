import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Comment, UserComment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://127.0.0.1:8000/api/comments/'

  constructor(private http: HttpClient) { }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<{data: Comment[]}>(this.apiUrl).pipe(
      map(response => response.data)
    )
  }

  getCommentById(id: number): Observable<Comment> {
    return this.http.get<{data: Comment}>(this.apiUrl + id).pipe(
      map(response => response.data)
    )
  }

  createComment(userComment: UserComment): Observable<any> {
    return this.http.post(this.apiUrl, userComment)
  }
}
