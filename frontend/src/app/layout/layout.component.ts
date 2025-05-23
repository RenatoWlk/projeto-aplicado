import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SubheaderComponent } from './subheader/subheader.component';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [HeaderComponent, FooterComponent, MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule, MatIconModule, RouterModule,
    SubheaderComponent,
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
