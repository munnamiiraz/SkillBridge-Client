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

export function getMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDateString(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    timeZone: 'Asia/Dhaka'
  });
}

export function getDayNameString(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Dhaka' });
}

export function timeToMinutesString(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function getWeekDatesString(currentWeekStart: Date): string[] {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    dates.push(formatDateString(date));
  }
  return dates;
}

export function initializeWeekSchedule(weekStart: Date): WeeklySchedule {
  const schedule: WeeklySchedule = {};
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    
    const dateKey = formatDateString(date);
    schedule[dateKey] = {
      date: dateKey,
      dayName: getDayNameString(date),
      displayDate: formatDisplayDateString(date),
      isEnabled: false,
      slots: []
    };
  }
  
  return schedule;
}

export function splitSlotsIntoHourlyChunks(slots: any[]): any[] {
  const result: any[] = [];

  for (const slot of slots) {
    let start = timeToMinutesString(slot.startTime);
    const end = timeToMinutesString(slot.endTime);

    while (start + 60 <= end) {
      result.push({
        date: slot.date,
        startTime: minutesToTimeString(start),
        endTime: minutesToTimeString(start + 60),
      });

      start += 60;
    }
  }

  return result;
}
