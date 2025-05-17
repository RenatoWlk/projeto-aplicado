import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardConstants } from './constants/dashboard.constants';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  postsSectionTitle: string = DashboardConstants.POSTS_SECTION_TITLE;
  offersSectionTitle: string = DashboardConstants.OFFERS_SECTION_TITLE;
  posts: any = { key: "Teste" };
  offers: any = { key: "Teste" };
}
