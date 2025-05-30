import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-banner',
  imports: [CommonModule],
  templateUrl: './notification-banner.component.html',
  styleUrl: './notification-banner.component.scss'
})
export class NotificationBannerComponent {
  @Input() message: string = '';
  @Input() type: 'sucess' | 'warning' | 'error' = 'sucess';
  @Input() duration: number = 5000;

  visible: boolean = true;
  fadingOut: boolean = false;

  ngOnInit():void {
    setTimeout(() => {
      this.fadingOut = true;


      this.visible = false;
    }, this.duration)
  }


  get bannerClass(): string {
    return `banner-${this.type}`;
  }

}
