import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  registrationError: string | null = null;
  formSubmitted = false;
  loading:boolean=false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      fname: ['', [Validators.required, Validators.maxLength(100),Validators.pattern("^[A-Za-z]+$")]],
      lname: ['', [Validators.required, Validators.maxLength(100),Validators.pattern("^[A-Za-z]+$")]],
      phone: ['', [Validators.required, Validators.maxLength(13),Validators.minLength(11), Validators.pattern(/^[0-9]+$/)]],
      address: ['', [Validators.required, Validators.maxLength(255),Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s,'\-_]*$/)]],
      city: ['',[Validators.required,Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s,'\-_]*$/)]],
      role: ['guest', [Validators.required, Validators.maxLength(50)]],
      age: ['', [Validators.required, Validators.min(18),Validators.max(120)]],
      photo: [''],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });

    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        this.registrationError = params['error'];
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('password_confirmation')!.value
      ? null : { 'mismatch': true };
  }

  onRegister() {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const userData = this.registerForm.value;
    this.loading=true;
    this.authService.register(userData).subscribe(
      (res) => {
        // if (userData.role === 'owner') {
        //   this.router.navigate(['/register/hotel'], { queryParams: { owner_id: res.user.id } });
        // } else {
        //   this.router.navigate(['/login']);
        // }
        this.authService.handleLoginSuccess(res);
        this.navigateToDashboardOrHome(userData.role, res);
        this.loading = false;
      },
      (error) => {
        // console.error('Registration failed :', error);
        if (error.error && error.error.message) {
        // console.error('Registration failed error: ', error.error);

          if (error.error.message === "Email not Signup yet") {
            this.registrationError = "Your email is not signed up yet. Please register.";
          } else {
            this.registrationError = error.error.message;
          }
          // console.log(this.registrationError);
        } else {
          this.registrationError = 'Failed to register. Please try again later.';
        }
        this.loading = false;
      }
    );
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  shouldShowError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || this.formSubmitted)
    );
  }
  private navigateToDashboardOrHome(role: string,res:any) {
    switch (role) {
      case 'owner':
          this.router.navigate(['/register/hotel'], { queryParams: { owner_id: res.user.id } });
        break;
      case 'admin':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'guest':
        this.router.navigate(['/home']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }
  validateAge() {
    const ageControl = this.registerForm.get('age');
    if (ageControl && ageControl.value < 0) {
      ageControl.setValue(0);
    }
  }
}
