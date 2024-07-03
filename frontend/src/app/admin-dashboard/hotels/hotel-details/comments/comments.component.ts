import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { HotelsService } from '../../../../services/hotels.service';
import { CommentService } from '../../../../services/comment.service';
import { Comment } from '../../../../models/comment';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule,RouterLink],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent {
  hotelId: number | undefined;
  sub: Subscription | null = null;
  isLoading: boolean = false;
  hotelComments: { [key: number]: Comment[] } = {};
  currentPage: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hotelService: HotelsService,
    private commentService: CommentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.hotelId = +params['id'];
      if (this.hotelId) {
        this.fetchCommentsForHotel(this.hotelId);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  fetchCommentsForHotel(hotelId: number): void {
    this.commentService.getCommentsByHotelId(hotelId).subscribe(
      (comments) => {
        this.hotelComments[hotelId] = comments;
        console.log(`Comments for hotel ${hotelId}:`, comments);
      },
      (error) => {
        console.error(`Error fetching comments for hotel ${hotelId}:`, error);
      }
    );
  }

  onDeleteComment(commentId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.deleteComment(commentId).subscribe({
          next: () => {
            if (this.hotelId) {
              this.hotelComments[this.hotelId] = this.hotelComments[this.hotelId].filter(comment => comment.id !== commentId);
              Swal.fire(
                'Deleted!',
                'Your comment has been deleted.',
                'success'
              );
            }
          },
          error: (error) => {
            console.error('Error deleting comment', error);
            Swal.fire(
              'Error!',
              'There was an error deleting the comment.',
              'error'
            );
          }
        });
      }
    });
  }


}
