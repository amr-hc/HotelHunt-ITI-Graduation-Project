import { Component, Input, input, OnDestroy, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { Comment, UserComment } from '../../models/comment';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit, OnDestroy {
  // @Input() hotel_id: number|undefined = 0;
  hotel_id: number | null = 0;
  private hotelIdSubscription: Subscription | null = null;
  comments: Comment[] = [];
  userComment: string = '';
  private commentSubscription: Subscription | null = null;
  user_id: number | null = 0;

  constructor(private commentService: CommentService
    , private HotelService: HotelService
  ) { }
  ngOnInit(): void {
    this.user_id = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
    console.log('User ID:', this.user_id);
    console.log(typeof this.user_id);
    this.hotelIdSubscription = this.HotelService.hotelId$.subscribe(
      (id) => {
        this.hotel_id = id;
        console.log('Hotel ID:', this.hotel_id);
      },
      (error: any) => {
        console.error('Error fetching hotel ID', error);
      }
    )
    this.loadComments();
  }
  loadComments() {
    this.commentSubscription = this.commentService.getAllComments().subscribe(
      (data: Comment[]) => {
        // console.log("Full response data:", data);

        this.comments = data.filter(comment => comment.hotel_id == this.hotel_id);
        console.log("Comments:", this.comments);
      },
      (error: any) => {
        console.error('Error fetching comments', error);
      }
    );
  }

  addComment() {
    if (this.userComment.trim() && this.hotel_id) {
      const newComment = new UserComment(this.user_id, this.hotel_id, this.userComment);
      this.commentService.createComment(newComment).subscribe(
        (comment: Comment) => {
          // this.comments.push(comment);
          this.loadComments();
          this.userComment = '';
        },
        (error: any) => {
          console.error('Error adding comment', error);
        }
      );
    }
  }
  ngOnDestroy(): void {
    if (this.commentSubscription) {
      this.commentSubscription.unsubscribe();
    }

    if (this.hotelIdSubscription) {
      this.hotelIdSubscription.unsubscribe();
    }
  }
}
