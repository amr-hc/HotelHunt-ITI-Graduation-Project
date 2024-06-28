import { Component } from '@angular/core';
import { RoomtypeService } from '../../services/roomtype.service';
import { RoomType } from '../../models/roomtype';
import { CommonModule } from '@angular/common';
import { RouterModule,Router} from '@angular/router';
import Swal from 'sweetalert2';

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

  remove(id: any) {
    // Show the SweetAlert2 confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Proceed with the deletion if confirmed
            this.serv.delete(id).subscribe(
                (data: any) => {
                    this.message = "Deleted Successfully";
                    setTimeout(() => {
                        this.message = "";
                        this.showData(); // Refresh the data
                    }, 2000);
                },
                (error) => {
                    console.error('Error deleting item:', error);
                    this.message = 'Error deleting item. Please try again.';
                }
            );

            // Show a success message using SweetAlert2
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            );
        }
    });
}

  addRoomType() {
    this.router.navigate(['/owner/add']);
  }
}
