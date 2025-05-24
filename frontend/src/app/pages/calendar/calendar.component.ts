import { Component, ChangeDetectionStrategy, model, ViewEncapsulation, OnInit } from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { CommonModule } from '@angular/common';
import { CalendarStats } from './calendar.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [MatDatepickerModule, MatCardModule, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit{

  readonly customHeader = CustomHeaderComponent;
  selected: Date | null = new Date();

  calendarStats : CalendarStats = {
    lastDonationDate : new Date(),
    nextDonationDate : new Date(),
    daysUntilNextDonation : 0,

  }

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

    this.calendarStats.nextDonationDate = this.selected;
    this.calendarStats.daysUntilNextDonation = this.timeUntinNextDonationCalculator(this.selected);
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

