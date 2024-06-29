import { Component, OnInit } from '@angular/core';
import { RoomtypeService } from '../../services/roomtype.service';
import { RoomType } from '../../models/roomtype';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
  id: any;
  object: RoomType = {
    id: 0,
    name: '',
    price: 0,
    description: '',
    capacity: 0,
    photo: ''
  };

  constructor(
    private roomtypeService: RoomtypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.roomtypeService.getById(this.id).subscribe(
      (data: RoomType) => {
        this.object = data;
        console.log('Fetched RoomType:', this.object);
      },
      (error) => {
        console.error('Error fetching RoomType:', error);
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/owner/list']);
  }
}
