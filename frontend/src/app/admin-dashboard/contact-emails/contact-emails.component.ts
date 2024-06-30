import { Component } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-contact-emails',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule],
  templateUrl: './contact-emails.component.html',
  styleUrl: './contact-emails.component.css'
})
export class ContactEmailsComponent {
  contactEmails: { id: number, email: string, message: string, created_at: string }[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  currentPage: number = 1;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.fetchContactEmails();
  }

  fetchContactEmails(): void {
    this.isLoading = true;
    this.contactService.getContacts().subscribe({
      next: (contacts) => {
        this.contactEmails = contacts.map((contact: any) => ({
          id: contact.id,
          email: contact.email,
          message: contact.message,
          created_at: contact.created_at
        }));
        this.contactEmails.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load contact emails';
        this.isLoading = false;
      }
    });
  }

  deleteContactEmail(contactId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this contact email!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.deleteContact(contactId).subscribe({
          next: () => {
            this.contactEmails = this.contactEmails.filter(contact => contact.id !== contactId);
            Swal.fire('Deleted!', 'The contact email has been deleted.', 'success');
          },
          error: (err) => {
            this.error = 'Failed to delete contact email';
            Swal.fire('Error!', 'Failed to delete contact email.', 'error');
          }
        });
      }
    });
  }
}
