import { Component, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderService } from '../header/header.service';

@Component({
  selector: 'app-subheader',
  imports: [CommonModule, RouterModule],
  templateUrl: './subheader.component.html',
  styleUrl: './subheader.component.scss'
})
export class SubheaderComponent {
  constructor(private headerService: HeaderService) {}

  changeSlogan() {
    this.headerService.triggerSloganChange();
  }
}
