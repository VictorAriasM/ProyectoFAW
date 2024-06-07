import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-welcome-banner',
  standalone: true,
  imports: [],
  templateUrl: './welcome-banner.component.html',
  styleUrl: './welcome-banner.component.css',
})
export class WelcomeBannerComponent {
  @Input() sideImage: string = '/login-image.jpg';
}
