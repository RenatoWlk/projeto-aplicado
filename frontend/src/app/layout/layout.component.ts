import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AsideComponent } from './aside/aside.component';
import { MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SubheaderComponent } from './subheader/subheader.component';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [HeaderComponent, FooterComponent, AsideComponent, MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule, MatIconModule, RouterModule, SubheaderComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss',]
})
export class LayoutComponent implements OnInit{
  isSidenavOpen = false;
  
  constructor() {
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  ngOnInit() {
    localStorage.setItem('token', 'fake-token'); // Testa o roteamento das páginas;
  }
}
