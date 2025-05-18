import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface Offer {
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

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private offersUrl = '/api/offers';
    private campaignsUrl = '/api/campaigns';

    constructor(private http: HttpClient) {}

    getOffers(): Observable<Offer[]> {
        return this.http.get<Offer[]>(this.offersUrl);
    }

    getCampaigns(): Observable<Campaign[]> {
        return this.http.get<Campaign[]>(this.campaignsUrl);
    }
}