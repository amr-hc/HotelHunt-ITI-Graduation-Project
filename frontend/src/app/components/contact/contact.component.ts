// src/app/contact/contact.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { HeaderComponent } from '../../layouts/header/header.component';
import { FooterComponent } from '../../layouts/footer/footer.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  formSubmitted = false;
  recaptchaResponse = '';

  constructor(private fb: FormBuilder, private contactService: ContactService) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      recaptcha: ['', Validators.required] // Add recaptcha control
    });

    // Load the reCAPTCHA script
    this.loadRecaptchaScript();
    window.grecaptchaCallback = (response: string) => {
      this.recaptchaResponse = response;
      this.contactForm.patchValue({ recaptcha: response });
    };
  }

  loadRecaptchaScript() {
    if (!window.grecaptcha) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=recaptchaLoaded&render=explicit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      this.renderRecaptcha();
    }

    window.recaptchaLoaded = this.renderRecaptcha.bind(this);
  }

  renderRecaptcha() {
    if (window.grecaptcha && document.getElementById('recaptcha-container')) {
      window.grecaptcha.render('recaptcha-container', {
        'sitekey': '6LdUfgQqAAAAAEDFznsS_EBOwlJ8eFajoAgGmBWB',
        'callback': window.grecaptchaCallback,
      });
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.contactForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to submit the form?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        cancelButtonText: 'No, cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.contactService.sendMessage(this.contactForm.value).subscribe(
            response => {
              Swal.fire({
                title: 'Success!',
                text: 'Contact form submitted successfully',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                this.contactForm.reset();  // Clear the form after success confirmation
                this.formSubmitted = false;
                this.recaptchaResponse = '';
                window.grecaptcha.reset(); // Reset reCAPTCHA
              });
            },
            error => {
              Swal.fire({
                title: 'Error!',
                text: 'Error submitting contact form',
                icon: 'error',
                confirmButtonText: 'OK'
              }).then(() => {
                this.contactForm.reset();  // Clear the form after error confirmation
                this.formSubmitted = false;
                this.recaptchaResponse = '';
                window.grecaptcha.reset(); // Reset reCAPTCHA
              });
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: 'Cancelled',
            text: 'Your form submission was cancelled',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => {
            this.contactForm.reset();  // Clear the form after cancellation confirmation
            this.formSubmitted = false;
            this.recaptchaResponse = '';
            window.grecaptcha.reset(); // Reset reCAPTCHA
          });
        }
      });
    }
  }

  shouldShowError(controlName: string) {
    const control = this.contactForm.get(controlName);
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || this.formSubmitted)
    );
  }
}
