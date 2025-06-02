import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BloodBankDashboardService } from "../../dashboard/bloodbank-dashboard/bloodbank-dashboard.service";
import { DonationSlots } from "../bloodbank-calendar/bloodbank-calendar.service";

export interface BloodBank {
    id: string;
    name: string;
    address: any;
    availabilitySlots: any;
}

@Injectable({
    providedIn: 'root'
})
export class DonationService {
    
    private readonly API = 'api/bloodbanks';
    
    constructor(private http: HttpClient) {}

    getBloodBanksWithAvailableSlots(): Observable<BloodBank[]> {
        return this.http.get<BloodBank[]>(`${this.API}/available-slots`);
    }

    scheduleDonation(date: Date): Observable<any> {
        return this.http.post(`${this.API}/donate`, date);
    }

    getSlotsByBloodBankId(): Observable<DonationSlots[]> {
        return this.http.get<DonationSlots[]>(`${this.API}/available-dates`);
    }

    getAvailableDonationDates(): Observable<{ startDate: string; endDate: string }[]> {
    return this.http.get<{ startDate: string; endDate: string }[]>(`${this.API}/available-dates`);
    }

    getAvailableDonationHours(): Observable<{ startTime: string; endTime: string }[]> {
        return this.http.get<{ startTime: string; endTime: string }[]>(`${this.API}/available-hours`);
    }

}