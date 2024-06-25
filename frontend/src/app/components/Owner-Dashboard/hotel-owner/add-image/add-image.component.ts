import { Component } from '@angular/core';
import { HotelService } from '../../../../services/hotel.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-image',
  standalone: true,
  imports: [],
  templateUrl: './add-image.component.html',
  styleUrl: './add-image.component.css'
})
export class AddImageComponent {
  selectedFiles: FileList | undefined;
  hotelId: number | undefined; // Declare hotelId property

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private router:Router
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
    this.selectedFiles = fileList;
  }

  onSubmit(event: Event) {
    event.preventDefault(); // Prevent default form submission

    if (this.hotelId && this.selectedFiles && this.selectedFiles.length > 0) {
      this.hotelService.addHotelImages(this.hotelId, this.selectedFiles).subscribe(
        (response) => {
          console.log('Images uploaded successfully:', response);
          this.router.navigate(['/owner/hotel'])
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
