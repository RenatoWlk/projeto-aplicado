import { Component } from '@angular/core';
import { CustomHeaderComponent } from '../custom-header/custom-header.component';
import { CalendarStats } from '../calendar.service';
import { BloodbankService } from './bloodbank-calendar.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-bloodbank-calendar',
  imports: [MatDatepickerModule, MatCardModule, CommonModule, MatFormFieldModule],
  templateUrl: './bloodbank-calendar.component.html',
  styleUrl: './bloodbank-calendar.component.scss'
})
export class BloodbankCalendarComponent {

  readonly customHeader = CustomHeaderComponent;
  selected: Date | undefined = new Date();

  calendarStats : CalendarStats = {
    lastDonationDate : new Date(),
    nextDonationDate : new Date(),
    daysUntilNextDonation : 0,

  }

  startDate: Date | undefined = undefined;
  endDate: Date | undefined = undefined;

  constructor(
    private bloodbankService: BloodbankService,
  ) {}

  dateClass = (date: Date) => {
    if (this.isRangeStart(date)) return 'range-start';
    if (this.isRangeEnd(date)) return 'range-end';
    if (this.isInRange(date)) return 'range-between';
    return '';
  };


  selectDate(date: Date) {
    if (!this.startDate || (this.startDate && this.endDate)) {
      this.startDate = date;
      this.endDate = undefined;
    } else if (date < this.startDate) {
      this.endDate = this.startDate;
      this.startDate = date;
    } else {
      this.endDate = date;
    }
  }

  isInRange(date: Date):boolean {
    if (!this.startDate || !this.endDate) return false;
    return date > this.startDate && date < this.endDate;
  }

  isRangeStart(date: Date) {
    return this.startDate?.toDateString() === date.toDateString();
  }

  isRangeEnd(date: Date) {
    return this.endDate?.toDateString() === date.toDateString();
  }


  addAvailableSlots() {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7)
  
    const startHour = 8;
    const endHour = 17;

    this.bloodbankService.addAvailableSlots(startDate, endDate, startHour, endHour)
    .subscribe({
      next: () => {
        // Sucesso
      },
      error: () => {
        // Erro
      },
    });
  }
}
