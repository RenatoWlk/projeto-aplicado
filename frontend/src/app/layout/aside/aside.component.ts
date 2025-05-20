import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import {MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule}  from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-aside',
  imports: [CommonModule, MatSidenavModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIcon, RouterModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AsideComponent {
  opened: boolean = false;
}
