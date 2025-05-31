import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BloodType } from '../../../shared/app.enums';

export interface Donor {
  name: string;
  totalDonations: number;
  bloodtype: BloodType;
}

export interface PointUser {
  name: string;
  points: number;
  bloodtype: BloodType;
}

@Injectable({
    providedIn: 'root'
})
export class LeaderboardsService {
  constructor() {}

  getTopDonors(): Observable<Donor[]> {
    const mockDonors: Donor[] = Array.from({ length: 50 }, (_, i) => ({
      name: `Doador ${i + 1}`,
      totalDonations: Math.floor(Math.random() * 100 + 1),
      bloodtype: BloodType.O_POSITIVE
    }));
    return of(mockDonors);
  }

  getTopPointUsers(): Observable<PointUser[]> {
    const mockPoints: PointUser[] = Array.from({ length: 50 }, (_, i) => ({
      name: `Usuário ${i + 1}`,
      points: Math.floor(Math.random() * 1000 + 100),
      bloodtype: BloodType.AB_POSITIVE
    }));
    return of(mockPoints);
  }
}
