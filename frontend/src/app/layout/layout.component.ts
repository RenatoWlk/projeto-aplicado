import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SubheaderComponent } from './subheader/subheader.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [HeaderComponent, FooterComponent, MatIconModule, RouterModule,
    SubheaderComponent, CommonModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss',]
})
export class LayoutComponent {
  isSidenavOpen = false;
  
  constructor() {
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
