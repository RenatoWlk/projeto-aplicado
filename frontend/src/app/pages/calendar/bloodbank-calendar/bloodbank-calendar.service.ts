import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class BloodbankService {
    constructor(private http: HttpClient) {}

    addAvailableSlots(startDate: Date, endDate: Date, startHour: number, endHour: number) {
        return this.http.post('/api/bloodblank/availability', {
            startDate,
            endDate,
            startHour,
            endHour
        });
    }
}