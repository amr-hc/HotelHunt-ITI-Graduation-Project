import { Component } from '@angular/core';
import { RoomtypeService } from '../../services/roomtype.service';
import { RoomType } from '../../models/roomtype';
import { CommonModule } from '@angular/common';
import { RouterModule,Router} from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  message = "";
  //allData! : RoomType[] ;
  allData: RoomType[] = [];
  showData () {
    this.serv.get().subscribe(
      (data : any) => {
        // console.log(data);
        this.allData = data ;

      }
    );
  }

  constructor(private serv: RoomtypeService,private router: Router){
    this.showData();
  }

  remove(id : any) {
    this.serv.delete(id).subscribe(
      (data : any ) => {
        this.message = " Delete Successfully " ;
        setTimeout(() => {
          this.message = ""
        }, 2000 );
      }
    );

    this.showData();

  }

  addRoomType() {
    this.router.navigate(['/owner/add']);
  }
}
