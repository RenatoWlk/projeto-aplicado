import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardConstants } from './constants/dashboard.constants';
import { Campaign, DashboardService, Offer } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // Constants
  postsSectionTitle: string = DashboardConstants.POSTS_SECTION_TITLE;
  offersSectionTitle: string = DashboardConstants.OFFERS_SECTION_TITLE;

  // Variables
  posts: Campaign[] = [{title: 'Título da campanha', body: 'A vida de alguém pode estar a uma doação de distância. Participe da nossa campanha de doação de sangue e ajude a encher os estoques dos hemocentros que salvam milhares de pessoas todos os dias. Seja você a diferença. Doe sangue, compartilhe vida.', startDate: new Date("05/05/25"), endDate: new Date("06/06/25"), location: {street: 'Rua 1', city: 'Campinas', state: 'SP', zip: '13087-607'}, phone: '(19) 99770-4598'}, {title: 'Título da campanha', body: 'A vida de alguém pode estar a uma doação de distância. Participe da nossa campanha de doação de sangue e ajude a encher os estoques dos hemocentros que salvam milhares de pessoas todos os dias. Seja você a diferença. Doe sangue, compartilhe vida.', startDate: new Date("05/05/25"), endDate: new Date("06/06/25"), location: {street: 'Rua 1', city: 'Campinas', state: 'SP', zip: '13087-607'}, phone: '(19) 99770-4598'}];
  offers: Offer[] = [{partnerName: 'Farmácia 1', title: 'Título da oferta', description: 'Descrição da oferta', validUntil: new Date("06/06/25"), discountPercentage: 20}, {partnerName:'Farmácia 2', title: 'Título da oferta', description: 'Descrição da oferta', validUntil: new Date("06/06/25"), discountPercentage: 20}, {partnerName: 'Funerária Santa Maria', title: 'Sua morte nossa alegria', description: 'Morra e tenha 15% de desconto', validUntil: new Date("06/06/06"), discountPercentage: 15}];
  nearbyBloodbanks: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  /**
   * Fetches the offers from the dashboard service.
   */
  public getOffers(): void {
    this.dashboardService.getOffers().subscribe((response: any) => {
      this.offers = response;
    });
  }

  /**
   * Fetches the posts from the dashboard service.
   */
  public getPosts(): void {
    this.dashboardService.getCampaigns().subscribe((response: any) => {
      this.posts = response;
    });
  }

  ngOnInit(): void {
    this.getPosts();
    this.getOffers();
  }
}
