import { Component } from '@angular/core';
import { RoomtypeService } from '../../services/roomtype.service';
import { RoomType } from '../../models/roomtype';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css'],
})
export class ShowComponent {
  id!: any;
  object: RoomType = {
    id: 0,
    name: '',
    hotel_id: 0,
    price: 0,
    description: '',
    capacity: 0,
  };

  constructor(
    private serv: RoomtypeService,
    private activatedRoute: ActivatedRoute,
    private router: Router // Inject Router service
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.serv.getById(this.id).subscribe((data: any) => {
      console.log(data);
      this.object = data;
    });
  }

  reset() {
    this.router.navigate(['/list']); 
  }
}
