import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
    constructor (private http: HttpClient) {}
    bookings: any = [];

    ngOnInit(): void {
        this.fetchBookings()
    }

    getDateTimeStr(startDate: string): string {
        const date = new Date(startDate);
        const day = date.getDate();
        const month = date.toLocaleString('ru-RU', { month: 'short' });
        const weekday = date.toLocaleString('ru-RU', { weekday: 'short' });
        const hours = date.getHours();
        const minutes = date.getMinutes();
        
        return `${day}.${month} (${weekday}) ${hours}:${minutes === 0 ? '00' : minutes}`
    }

    fetchBookings() {
        this.http.get('http://localhost:3000/api/bookings')
            .subscribe({
                next: (response) => {
                    const data = (response as { data: any[] }).data;
                    this.bookings = data.map(item => ({...item, dateTimeStr: this.getDateTimeStr(item.schedule_start)}));
                },
                error: (error) => {
                    console.error('Error', error);
                }
            });
    }
}