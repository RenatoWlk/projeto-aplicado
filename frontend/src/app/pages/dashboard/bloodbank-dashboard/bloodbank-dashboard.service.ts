import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BloodType } from '../../../shared/app.enums';
import { Campaign } from '../dashboard.service';
import { DashboardConstants } from '../constants/dashboard.constants';
import { AuthService } from '../../../core/services/auth/auth.service';

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
    constructor(private http: HttpClient, private auth: AuthService) {}

    getBloodbankStats(bloodbankId: string): Observable<BloodBankStats> {
        return this.http.get<BloodBankStats>(`/api/bloodbanks/${bloodbankId}/stats`);
    }

    getBloodbankCampaigns(bloodbankId: string): Observable<Campaign[]> {
        return this.http.get<Campaign[]>(`/api/bloodbanks/${bloodbankId}/campaigns`);
    }

    createCampaign(campaign: Campaign): Observable<Campaign> {
        const data = {campaign, bloodbankEmail: this.auth.getCurrentUserEmail()};
        return this.http.post<Campaign>(DashboardConstants.CREATE_CAMPAIGN_ENDPOINT, data);
    }
}