import { apiClient } from '@/lib/api-client';

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
}

export interface DayAvailability {
  date: string;
  dayName: string;
  displayDate: string;
  isEnabled: boolean;
  slots: TimeSlot[];
}

export interface WeeklySchedule {
  [key: string]: DayAvailability;
}

export const TutorAvailabilityService = {
  // --- API Calls ---

  async getAvailability(weekStartDate: string): Promise<any> {
    const response = await apiClient.get(`/api/tutor/availability-slots?weekStartDate=${weekStartDate}`);
    return response.success ? response.data : null;
  },

  async saveAvailability(weekStartDate: string, slots: any[]): Promise<any> {
    const response = await apiClient.put('/api/tutor/availability-slots', {
      weekStartDate,
      slots
    });
    return response;
  },

  // --- Date/Time Helpers ---

  getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  },

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  formatDisplayDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  },

  getDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  },

  timeToMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  },

  minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  },

  getWeekDates(currentWeekStart: Date): string[] {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(this.formatDate(date));
    }
    return dates;
  },

  initializeWeekSchedule(weekStart: Date): WeeklySchedule {
    const schedule: WeeklySchedule = {};
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      
      const dateKey = this.formatDate(date);
      schedule[dateKey] = {
        date: dateKey,
        dayName: this.getDayName(date),
        displayDate: this.formatDisplayDate(date),
        isEnabled: false,
        slots: []
      };
    }
    
    return schedule;
  },

  splitSlotsIntoHourly(slots: any[]): any[] {
    const result: any[] = [];

    for (const slot of slots) {
      let start = this.timeToMinutes(slot.startTime);
      const end = this.timeToMinutes(slot.endTime);

      while (start + 60 <= end) {
        result.push({
          date: slot.date,
          startTime: this.minutesToTime(start),
          endTime: this.minutesToTime(start + 60),
        });

        start += 60;
      }
    }

    return result;
  }
};
