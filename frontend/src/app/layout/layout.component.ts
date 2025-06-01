import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SubheaderComponent } from './subheader/subheader.component';
import { CommonModule } from '@angular/common';
import { UserRole } from '../shared/app.enums';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [HeaderComponent, FooterComponent, MatIconModule, RouterModule,
    SubheaderComponent, CommonModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss',]
})
export class LayoutComponent implements OnInit{
  
  userType: UserRole = UserRole.User;

  readonly UserRole = UserRole;
  
  constructor() {}

  ngOnInit() {
    //this.userType = this.authService.getCurrentUserRole();
    this.userType = UserRole.Bloodbank;
    //this.userType = UserRole.User;
    //this.userType = UserRole.Partner;
  }
}
