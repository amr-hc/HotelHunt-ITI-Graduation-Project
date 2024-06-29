import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { HotelImage } from '../../../../models/hotelImage';
import { Hotel } from '../../../../models/hotel';
import { HotelService } from '../../../../services/hotel.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-images',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule],
  templateUrl: './images.component.html',
  styleUrl: './images.component.css',
})
export class ImagesComponent implements OnInit, OnDestroy {
  hotelId: number | undefined;
  ownerImages: { [key: number]: HotelImage[] } = {};
  sub: Subscription | null = null;
  isLoading: boolean = false;
  selectedFiles: FileList | undefined;
  currentPage: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hotelService: HotelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.hotelId = +params['id'];
      if (this.hotelId) {
        this.fetchHotelImages(this.hotelId);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  fetchHotelImages(hotelId: number): void {
    if (!hotelId) {
      return;
    }
    this.isLoading = true;
    this.hotelService.getHotelImages(hotelId).subscribe(
      (images) => {
        this.ownerImages[hotelId] = images;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error(`Error fetching images for hotel ${hotelId}:`, error);
      }
    );
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    this.selectedFiles = fileList;
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.hotelId && this.selectedFiles && this.selectedFiles.length > 0) {
      this.hotelService.addHotelImages(this.hotelId, this.selectedFiles).subscribe(
        (response) => {
          console.log('Images uploaded successfully:', response);
          // Update the ownerImages array with the new images
          if (this.hotelId) {
            this.fetchHotelImages(this.hotelId);
          }
        },
        (error) => {
          console.error('Error uploading images:', error);
        }
      );
    }
  }

  onDeleteImage(imageId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this image?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        this.hotelService.deleteHotelImage(imageId).subscribe(
          response => {
            Swal.fire('Deleted!', 'Your image has been deleted.', 'success');
            // Remove the image from the ownerImages array
            if (this.hotelId) {
              this.ownerImages[this.hotelId] = this.ownerImages[this.hotelId].filter(image => image.id !== imageId);
            }
          },
          error => {
            Swal.fire('Error!', 'There was an error deleting the image.', 'error');
            console.error('Error deleting image:', error);
          }
        );
      }
    });
  }
}
