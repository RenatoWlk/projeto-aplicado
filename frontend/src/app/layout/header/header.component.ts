import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss',]
})
export class HeaderComponent {

  @Input() isSidenavOpen!: boolean;
  @Output() toggleSidenav = new EventEmitter<void>();
  
  onMenuClick() {
    this.toggleSidenav.emit();
  }

}
