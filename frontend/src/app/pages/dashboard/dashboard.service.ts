import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achievement } from '../account/account.service';

export enum BloodType {
    A_POSITIVE = 'A+',
    A_NEGATIVE = 'A-',
    B_POSITIVE = 'B+',
    B_NEGATIVE = 'B-',
    AB_POSITIVE = 'AB+',
    AB_NEGATIVE = 'AB-',
    O_POSITIVE = 'O+',
    O_NEGATIVE = 'O-'
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface Offer {
    partnerName: string;
    title: string;
    description: string;
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
    timeUntilNextDonation: number;
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
    private offersUrl = '/api/dashboard/offers';
    private campaignsUrl = '/api/dashboard/campaigns';
    private nearbyBloodbanksUrl = '/api/dashboard/nearbyBloodbanks';

    constructor(private http: HttpClient) {}

    getOffers(): Observable<Offer[]> {
        return this.http.get<Offer[]>(this.offersUrl);
    }

    getCampaigns(): Observable<Campaign[]> {
        return this.http.get<Campaign[]>(this.campaignsUrl);
    }

    getNearbyBloodbanks(): Observable<Bloodbank[]> {
        return this.http.get<Bloodbank[]>(this.nearbyBloodbanksUrl);
    }

    getUserStats(userId: string): Observable<UserStats> {
        return this.http.get<UserStats>(`/api/users/${userId}/stats`);
    }
}