import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import {MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule}  from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { QuestionnaireComponent } from '../../pages/questionnaire/questionnaire.component';

@Component({
  selector: 'app-aside',
  imports: [CommonModule, MatSidenavModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIcon],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AsideComponent {
  opened: boolean = false;
}
