import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss',]
})
export class HeaderComponent {

  @Output() toggleSidenav = new EventEmitter<void>();
  
  onMenuClick() {
    this.toggleSidenav.emit();
  }

}
