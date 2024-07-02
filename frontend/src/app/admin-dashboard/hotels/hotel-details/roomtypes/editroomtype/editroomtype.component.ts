import { Component, OnInit } from '@angular/core';
import { RoomtypeService } from '../../../../../services/roomtype.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RoomType } from '../../../../../models/roomtype';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editroomtype',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editroomtype.component.html',
  styleUrl: './editroomtype.component.css',
})
export class EditroomtypeComponent implements OnInit {
  editForm: FormGroup;
  roomId: number | null = null;
  hotelId: number | null = null;
  roomType: RoomType | null = null;
  formSubmitted: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private roomTypeService: RoomtypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z]*$/),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(255),
          Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s]*$/),
        ],
      ],
      price: [
        '',
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(999999.0),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      hotel_id: ['', Validators.required],
      capacity: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(12),
          Validators.pattern('^\\d+$'),
        ],
      ],
      photo: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.roomId = Number(this.route.snapshot.paramMap.get('roomId'));
    this.hotelId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.roomId);
    if (this.roomId) {
      this.roomTypeService.getById(this.roomId).subscribe(
        (response: any) => {
          this.roomType = response;
          console.log(this.roomType);
          if (this.roomType) {
            this.editForm.patchValue(this.roomType);
            this.editForm.get('photo')?.setValue(this.roomType.photo);
          }
        },
        (error) => {
          console.error('Error fetching room type details', error);
        }
      );
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.editForm.valid) {
      const formData = new FormData();
      Object.keys(this.editForm.controls).forEach((key) => {
        if (key !== 'photo' || this.selectedFile) {
          formData.append(key, this.editForm.get(key)?.value);
        }
      });

      if (this.selectedFile) {
        formData.append('photo', this.selectedFile, this.selectedFile.name);
      }

      console.log('Submitting the following FormData:');
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      this.roomTypeService.put(this.roomId, formData).subscribe(
        (response) => {
          console.log('Room type updated successfully', response);
          this.router.navigate([
            '/admin-dashboard/hotels/' + this.hotelId + '/rooms/',
          ]);
        },
        (error) => {
          console.error('Error updating room type', error);
        }
      );
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.isImageFile(file)) {
        this.selectedFile = file;
        this.editForm.get('photo')?.setValue(file);
        console.log('Selected file:', file);
      } else {
        console.error('The selected file is not an image.');
        this.selectedFile = null;
        this.editForm.get('photo')?.setErrors({ invalidFileType: true });
      }
    }
  }

  isImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

  onCancel(): void {
    this.router.navigate([
      '/admin-dashboard/hotels/' + this.hotelId + '/rooms/',
    ]);
  }
}
