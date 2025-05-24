import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardConstants } from './constants/dashboard.constants';
import { UserStats, Bloodbank, Campaign, DashboardService, Offer, BloodType } from './dashboard.service';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // Constants
  postsSectionTitle = DashboardConstants.POSTS_SECTION_TITLE;
  offersSectionTitle = DashboardConstants.OFFERS_SECTION_TITLE;

  // Data
  posts: Campaign[] = [{title: 'Título da campanha', body: 'A vida de alguém pode estar a uma doação de distância. Participe da nossa campanha de doação de sangue e ajude a encher os estoques dos hemocentros que salvam milhares de pessoas todos os dias. Seja você a diferença. Doe sangue, compartilhe vida.', startDate: new Date("05/05/25"), endDate: new Date("06/06/25"), location: {street: 'Rua 1', city: 'Campinas', state: 'SP', zip: '13087-607'}, phone: '(19) 99770-4598'}, {title: 'Título da campanha', body: 'A vida de alguém pode estar a uma doação de distância. Participe da nossa campanha de doação de sangue e ajude a encher os estoques dos hemocentros que salvam milhares de pessoas todos os dias. Seja você a diferença. Doe sangue, compartilhe vida.', startDate: new Date("05/05/25"), endDate: new Date("06/06/25"), location: {street: 'Rua 1', city: 'Campinas', state: 'SP', zip: '13087-607'}, phone: '(19) 99770-4598'}, {title: 'Título da campanha', body: 'A vida de alguém pode estar a uma doação de distância. Participe da nossa campanha de doação de sangue e ajude a encher os estoques dos hemocentros que salvam milhares de pessoas todos os dias. Seja você a diferença. Doe sangue, compartilhe vida.', startDate: new Date("05/05/25"), endDate: new Date("06/06/25"), location: {street: 'Rua 1', city: 'Campinas', state: 'SP', zip: '13087-607'}, phone: '(19) 99770-4598'}, {title: 'Título da campanha', body: 'A vida de alguém pode estar a uma doação de distância. Participe da nossa campanha de doação de sangue e ajude a encher os estoques dos hemocentros que salvam milhares de pessoas todos os dias. Seja você a diferença. Doe sangue, compartilhe vida.', startDate: new Date("05/05/25"), endDate: new Date("06/06/25"), location: {street: 'Rua 1', city: 'Campinas', state: 'SP', zip: '13087-607'}, phone: '(19) 99770-4598'}, {title: 'Título da campanha', body: 'A vida de alguém pode estar a uma doação de distância. Participe da nossa campanha de doação de sangue e ajude a encher os estoques dos hemocentros que salvam milhares de pessoas todos os dias. Seja você a diferença. Doe sangue, compartilhe vida.', startDate: new Date("05/05/25"), endDate: new Date("06/06/25"), location: {street: 'Rua 1', city: 'Campinas', state: 'SP', zip: '13087-607'}, phone: '(19) 99770-4598'}, {title: 'Título da campanha', body: 'A vida de alguém pode estar a uma doação de distância. Participe da nossa campanha de doação de sangue e ajude a encher os estoques dos hemocentros que salvam milhares de pessoas todos os dias. Seja você a diferença. Doe sangue, compartilhe vida.', startDate: new Date("05/05/25"), endDate: new Date("06/06/25"), location: {street: 'Rua 1', city: 'Campinas', state: 'SP', zip: '13087-607'}, phone: '(19) 99770-4598'}];
  offers: Offer[] = [{partnerName: 'Farmácia 1', title: 'Título da oferta', description: 'Descrição da oferta', validUntil: new Date("06/06/25"), discountPercentage: 20}, {partnerName:'Farmácia 2', title: 'Título da oferta', description: 'Descrição da oferta', validUntil: new Date("06/06/25"), discountPercentage: 20}, {partnerName: 'Funerária Santa Maria', title: 'Sua morte nossa alegria', description: 'Morra e tenha 15% de desconto', validUntil: new Date("06/06/06"), discountPercentage: 15}];
  nearbyBloodbanks: Bloodbank[] = [{name: 'Hemocentro de Campinas', address: {street: 'Rua 1', city: 'Campinas', state: 'SP', zip: '13087-607'}, phone: '(19) 99770-4598'}, {name: 'Hemocentro de São Paulo', address: {street: 'Rua 2', city: 'São Paulo', state: 'SP', zip: '13087-607'}, phone: '(11) 99770-4598'}, {name: 'Hemocentro de São José dos Campos', address: {street: 'Rua 3', city: 'São José dos Campos', state: 'SP', zip: '13087-607'}, phone: '(12) 99770-4598'}];
  userStats: UserStats = {timesDonated: 4, potentialLivesSaved: 0, timeUntilNextDonation: "438485", lastDonationDate: new Date("03/04/25"), achievements: [{title: 'Doador!', description: 'Você realizou a primeira doação', points: 100, rarity: 'Comum', imageUrl: 'fa-star'}, {title: '10 doações!', description: 'Você realizou 10 doações', points: 300, rarity: 'Raro', imageUrl: 'fa-heart'}, {title: '30 doações!', description: 'Você realizou 30 doações', points: 600, rarity: 'Épico', imageUrl: 'fa-hand-holding-heart'}, {title: '50 doações!', description: 'Você realizou 50 doações', points: 1000, rarity: 'Lendário', imageUrl: 'fa-award'}, {title: '100 doações!', description: 'Você realizou 100 doações', points: 10000, rarity: 'Lendário', imageUrl: 'fa-trophy'}, {title: 'Primeira campanha!', description: 'Você participou de uma campanha de doação', points: 100, rarity: 'Comum', imageUrl: 'fa-star'}], totalPoints: 100, bloodType: BloodType.A_POSITIVE};

  constructor(private dashboardService: DashboardService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Loads all required dashboard data.
   */
  private loadDashboardData(): void {
    this.getPosts();
    this.getOffers();
    this.getNearbyBloodbanks();
    this.getUserStats();
    this.sortAchievementsByRarity(this.userStats.achievements);
    this.userStats.potentialLivesSaved = this.calculatePotentialLivesSaved(this.userStats.timesDonated);
    this.userStats.timeUntilNextDonation = this.getReadableTimeUntilNextDonation(this.userStats.timeUntilNextDonation);
  }

  private getPosts(): void {
    this.dashboardService.getCampaigns().subscribe((posts: Campaign[]) => {
      this.posts = posts;
    });
  }

  private getOffers(): void {
    this.dashboardService.getOffers().subscribe((offers: Offer[]) => {
      this.offers = offers;
    });
  }

  private getNearbyBloodbanks(): void {
    this.dashboardService.getNearbyBloodbanks().subscribe((banks: Bloodbank[]) => {
      this.nearbyBloodbanks = banks;
    });
  }

  private getUserStats(): void {
    const userId = this.authService.getCurrentUserId();
    this.dashboardService.getUserStats(userId).subscribe((stats: UserStats) => {
      stats.achievements = this.sortAchievementsByRarity(stats.achievements);
      stats.potentialLivesSaved = this.calculatePotentialLivesSaved(stats.timesDonated);
      this.userStats = stats;
    });
  }

  /**
   * Returns a human-readable string for the time until the next donation.
   */
  getReadableTimeUntilNextDonation(secondsString: string): string {
    const seconds = parseInt(secondsString);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}min`);

    return parts.length > 0 ? parts.join(' ') : 'Já pode doar';
  }

  /**
   * Calculates how many lives were potentially saved.
   */
  private calculatePotentialLivesSaved(donations: number): number {
    return donations > 0 ? donations * 4 : 0;
  }

  /**
   * Sorts achievements by rarity (comum → raro → épico → lendário).
   */
  private sortAchievementsByRarity(achievements: any[]): any[] {
    const order: { [key: string]: number } = {
      comum: 1,
      raro: 2,
      épico: 3,
      lendário: 4
    };

    return achievements.sort((a, b) => order[a.rarity.toLowerCase()] - order[b.rarity.toLowerCase()]);
  }
}
