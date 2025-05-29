import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achievement } from '../account/account.service';
import { DashboardConstants } from './constants/dashboard.constants';
import { BloodType } from '../../shared/app.enums';
import { AuthService } from '../../core/services/auth/auth.service';

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface Offer {
    partnerName: string;
    title: string;
    body: string;
    validUntil: Date;
    discountPercentage: number;
}

export interface Campaign {
    title: string;
    body: string;
    startDate: Date;
    endDate: Date;
    location: Address;
    phone: string;
}

export interface UserStats {
    timesDonated: number;
    potentialLivesSaved: number;
    timeUntilNextDonation: string;
    lastDonationDate: Date;
    achievements: Achievement[];
    totalPoints: number;
    bloodType: BloodType;
}

export interface Bloodbank {
    name: string;
    address: Address;
    phone: string;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    constructor(private http: HttpClient, private auth: AuthService) {}

    getOffers(): Observable<Offer[]> {
        return this.http.get<Offer[]>(DashboardConstants.GET_OFFERS_ENDPOINT);
    }

    getCampaigns(): Observable<Campaign[]> {
        return this.http.get<Campaign[]>(DashboardConstants.GET_CAMPAIGNS_ENDPOINT);
    }

    getNearbyBloodbanks(): Observable<Bloodbank[]> {
        return this.http.get<Bloodbank[]>(DashboardConstants.GET_NEARBY_BLOODBANKS_ENDPOINT);
    }

    getUserStats(userId: string): Observable<UserStats> {
        return this.http.get<UserStats>(`/api/users/${userId}/stats`);
    }

    createOffer(offer: Offer): Observable<Offer> {
        const data = {offer, partnerEmail: this.auth.getCurrentUserEmail()};
        return this.http.post<Offer>(DashboardConstants.CREATE_OFFER_ENDPOINT, data);
    }
}