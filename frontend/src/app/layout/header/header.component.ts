import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss',]
})
export class HeaderComponent {

  isMenuOpen = false;
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // só fecha se clicar fora do botão/menu
    if (!target.closest('.left')) {
      this.isMenuOpen = false;
    }
  }

}
