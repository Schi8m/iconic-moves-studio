import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


const DAYS_IN_WEEK = 7;
const WORK_HOURS = {
    from: 10,
    to: 22
}

interface ITableData {
    rows: number;
    columns: number;
    data: any[][];
}

interface ITrainingData {
    class_group: string;
    created_at: string;
    start_time: string;
    end_time: string;
    id: number;
    room: string;
    teacher: string;
    title: string;
}

@Component({
    selector: 'app-schedule-page',
    templateUrl: './schedule-page.component.html',
    styleUrls: ['./schedule-page.component.css']
})

export class SchedulePageComponent implements OnInit {
    constructor (private http: HttpClient) {}

    tableConfig: ITableData = {
        rows: WORK_HOURS.to - WORK_HOURS.from,
        columns: DAYS_IN_WEEK,
        data: []
    }

    selectedTrainingId: number | null = null;
    showBookingModal: boolean = false;

    openBookingModal(cell: any) {
        this.selectedTrainingId = cell.id;
        this.showBookingModal = true;
    }

    closeBookingModal() {
        this.selectedTrainingId = null;
        this.showBookingModal = false
    }

    getData() {
        this.http.get('http://localhost:3000/api/schedule')
          .subscribe({
            next: (response) => {
              const data = (response as { data: ITrainingData[] }).data;
              
              this.tableConfig.data = this.createRows(data);
            },
            error: (err) => {
              console.error('Error:', err);
            }
          });
      }
    
    getDateStrWithOffset(offset: number): string {
        const date = new Date();
        date.setDate(date.getDate() + offset);
        const day = date.getDate();
        const month = date.toLocaleString('ru-RU', { month: 'short' });
        const weekday = date.toLocaleString('ru-RU', { weekday: 'short' });

        return `${day} ${month} | ${weekday}`
    }

    isTimeCell(cell: any) {
        return typeof cell.id === 'string' && cell.id.endsWith('0')
    }

    hasTraining(cell: any) {
        return !cell.isEmpty
    }

    signUpForClass(cell: any) {
        console.log(cell)
    }

    createCells(rowIndex: number, data: ITrainingData[] = []) {
        return Array(this.tableConfig.columns + 1)
            .fill(null)
            .map((item, index) => {
                const currentTime = `${WORK_HOURS.from + rowIndex}:00`;
                if (index === 0) {
                    return {
                        title: currentTime,
                        id: `${rowIndex}-${index}`,
                        isEmpty: true
                    }
                }

                const training = data.filter(i => new Date(i.start_time).getDay() === new Date().getDay() + index - 1)[0];
                
                if (training) {
                    return {...training,
                        isEmpty: false,
                        timeStr: `${currentTime} - ${WORK_HOURS.from + rowIndex + 1}:00`
                    };
                }
                return {
                    id: `${rowIndex}-${index}`,
                    isEmpty: true
                }
            })
    }

    createRows(data: ITrainingData[]) {
        return Array(this.tableConfig.rows)
            .fill(null)
            .map((item, index) => {
                const filteredByRowTimeTrainings = data.filter(i => new Date(i.start_time).getHours() === WORK_HOURS.from + index);
                
                return this.createCells(index, filteredByRowTimeTrainings)
            })
    }

    ngOnInit(): void {
        this.getData()
    }

  get columnIndexes(): string[] {
    return Array(this.tableConfig.columns).fill(0).map((_, i) => this.getDateStrWithOffset(i));
  }

  get rowIndexes(): number[] {
    return Array(this.tableConfig.rows).fill(0).map((_, i) => (i));
  }

}