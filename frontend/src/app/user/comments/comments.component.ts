import { Component, Input, input, OnDestroy, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { Comment, UserComment } from '../../models/comment';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../services/hotel.service';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserAuthService } from '../../services/user-auth.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [FormsModule,CommonModule,NgxPaginationModule],
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
  checkLoggedInUserRole: string = '';
  isUserVerified: string | null = null;
  commentError: string = '';
  currentPage = 1;
  itemsPerPage = 2;
  canComment: boolean = false;
  private canUserCommentSubscription: Subscription | null = null;
  constructor(private commentService: CommentService
    , private HotelService: HotelService,
    private userAuthComment: UserAuthService
  ) { }
  ngOnInit(): void {
    this.checkLoggedInUserRole = localStorage.getItem('userRole') || '';
    this.isUserVerified = localStorage.getItem('verified') || null;
    this.user_id = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
    this.hotelIdSubscription = this.HotelService.hotelId$.subscribe(
      (id) => {
        this.hotel_id = id;
        this.checkIfUserCanComment();
      },
      (error: any) => {
        // console.error('Error fetching hotel ID', error);
      }
    )
    this.loadComments();
  }
  checkIfUserCanComment(): void {
    if (this.hotel_id !== null) {
      this.canUserCommentSubscription = this.userAuthComment.canRateOrComment(this.hotel_id).subscribe(
        (data) => {
          this.canComment = data.can;
        },
        (error: any) => {
          console.error('Error fetching canRate', error);
        }
      );
    }
  }
  loadComments() {
    this.commentSubscription = this.commentService.getAllComments().subscribe(
      (data: Comment[]) => {
        // console.log("Full response data:", data);

        this.comments = data.filter(comment => comment.hotel_id == this.hotel_id);
      },
      (error: any) => {
        console.error('Error fetching comments', error);
      }
    );
  }

  addComment() {
    if (this.checkLoggedInUserRole !== 'guest' || this.isUserVerified === 'null' || this.isUserVerified === 'undefined') {
      Swal.fire({
        title: 'Comment Error',
        text: 'You must be a verified registered user to comment.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.canComment === false) {
      Swal.fire({
        title: 'Comment Error',
        text: `You Can't Add Comment on Hotel Without Reserving. Please Reserve First.`,
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    const trimmedComment = this.userComment.trim();
    if (trimmedComment === '') {
      this.commentError = 'Please enter a comment.';
      return;
    }

    this.commentError = '';  // Clear the error if the comment is valid
    if (this.hotel_id) {
      const newComment = new UserComment(this.user_id, this.hotel_id, trimmedComment);
      this.commentService.createComment(newComment).subscribe(
        (comment: Comment) => {
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
    if (this.canUserCommentSubscription) {
      this.canUserCommentSubscription.unsubscribe();
    }
  }
}
