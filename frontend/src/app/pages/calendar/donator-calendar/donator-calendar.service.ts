import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DonationService {
    constructor(private http: HttpClient) {}

    scheduleDonation(date: Date, userId: string) {
        return this.http.post('/api/donations/schedule', {
            userId,
            date
        });
    }
}