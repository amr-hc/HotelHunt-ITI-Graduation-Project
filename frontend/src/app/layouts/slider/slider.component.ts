import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {
  notActivatedMessage: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const verified = localStorage.getItem('verified');
    const token = localStorage.getItem('token');
    if (token){
      if (!verified || !Date.parse(verified)) {
        this.notActivatedMessage = 'Your account is not activated. Please check your email for the activation link.';
        setTimeout(() => {
          this.notActivatedMessage = null;
        }, 3000);
      }
    }
    }
  }

