import { Component, ChangeDetectionStrategy, model, ViewEncapsulation, OnInit } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CustomHeaderComponent } from '../custom-header/custom-header.component';
import { CommonModule } from '@angular/common';
import { CalendarStats } from '../calendar.service';
import { DonationService } from './donator-calendar.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-donator-calendar',
  standalone: true,
  imports: [MatDatepickerModule, MatCardModule, CommonModule],
  templateUrl: './donator-calendar.component.html',
  styleUrl: './donator-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  encapsulation: ViewEncapsulation.None,
})
export class DonatorCalendarComponent implements OnInit{

  readonly customHeader = CustomHeaderComponent;
  selected: Date | null = new Date();

  calendarStats : CalendarStats = {
    lastDonationDate : new Date(),
    nextDonationDate : new Date(),
    daysUntilNextDonation : 0,

  }

  constructor(
    private donationService: DonationService,
    private authService: AuthService
  ) {}

  setSelectedDate(date: Date) {
    this.selected = date;
    this.calendarStats.nextDonationDate = date;
    this.calendarStats.daysUntilNextDonation = this.timeUntinNextDonationCalculator(date);
  }

  ngOnInit(): void {
      this.calendarStats.daysUntilNextDonation = this.timeUntinNextDonationCalculator(this.calendarStats.nextDonationDate);
  }
  
  onDateSelected(date: Date) {
    this.selected = date;
  }

  scheduleDonation() {
    if (!this.selected) return;

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      //Banner de erro
      return;
    }

    this.donationService.scheduleDonation(this.selected, userId)
    .subscribe({
      next: () => {
        this.calendarStats.nextDonationDate = this.selected!;
        this.calendarStats.daysUntilNextDonation = this.timeUntinNextDonationCalculator(this.selected!);
        // Exibir banner de sucesso aqui
      },
      error: () => {
        // Exibir banner de erro aqui
      }
    })
  }

  timeUntinNextDonationCalculator(next: Date): any {
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const nextMidnight = new Date(next.getFullYear(), next.getMonth(), next.getDate());

    const diffInMs = nextMidnight.getTime() - todayMidnight.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays >= 0 ? diffInDays : 0;

  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  }

}

