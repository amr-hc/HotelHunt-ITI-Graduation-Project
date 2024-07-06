import { Component } from '@angular/core';
import { HotelService } from '../../../../services/hotel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-image.component.html',
  styleUrl: './add-image.component.css'
})
export class AddImageComponent {
  selectedFiles: FileList | undefined;
  hotelId: number | undefined; // Declare hotelId property
  imageErrors: string[] = []; // Array to store validation error messages

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private router: Router
  ) {}

  ngOnInit() {
    // Fetch hotel id from route parameters
    this.route.params.subscribe(params => {
      this.hotelId = +params['id']; // '+' converts string to number
    });
  }

  onFileChange(event: any) {
    // Retrieve selected files from the input element
    const fileList: FileList = event.target.files;
    this.imageErrors = []; // Clear previous errors

    // Validate files
    this.selectedFiles = fileList; // Store files in selectedFiles

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!this.validateImage(file)) {
        // If any file is invalid, clear selectedFiles and break
        this.selectedFiles = undefined;
        break;
      }
    }
  }

  validateImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 2MB

    // Check file type
    if (!validTypes.includes(file.type)) {
      this.imageErrors.push(`${file.name} has an invalid file type. Only JPEG, PNG, and GIF formats are allowed.`);
      return false;
    }

    // Check file size
    if (file.size > maxSize) {
      this.imageErrors.push(`${file.name} exceeds the maximum size of 10MB.`);
      return false;
    }

    return true;
  }

  onSubmit(event: Event) {
    event.preventDefault(); // Prevent default form submission

    if (this.hotelId && this.selectedFiles && this.selectedFiles.length > 0) {
      this.hotelService.addHotelImages(this.hotelId, this.selectedFiles).subscribe(
        (response) => {
          console.log('Images uploaded successfully:', response);
          this.router.navigate(['/owner/hotel']);
          // Optionally, reset form or show success message
        },
        (error) => {
          console.error('Error uploading images:', error);
          // Handle error - show error message or retry logic
        }
      );
    }
  }
}
