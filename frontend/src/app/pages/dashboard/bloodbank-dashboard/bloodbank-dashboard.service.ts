import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BloodType } from '../../../shared/app.enums';

export interface DonationsOverTime {
    donations: number;
    month: 'Jan' | 'Fev' | 'Mar' | 'Abr' | 'Mai' | 'Jun' | 'Jul' | 'Ago' | 'Set' | 'Out' | 'Nov' | 'Dez';
    year: number;
}

export interface BloodBankStats {
    totalDonations: number;
    scheduledDonations: number;
    donationsOverTime: DonationsOverTime[];
    bloodTypeBloodBags: {
        [key in keyof typeof BloodType]: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class BloodBankDashboardService {
    constructor(private http: HttpClient) {}

    getBloodbankStats(bloodbankId: string): Observable<BloodBankStats> {
        return this.http.get<BloodBankStats>(`/api/bloodbanks/${bloodbankId}/stats`);
    }
}