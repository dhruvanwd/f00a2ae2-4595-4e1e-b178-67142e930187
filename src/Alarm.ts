import { IDay, ITime } from "./types";

export class Alarm {
  day: IDay;
  time: ITime;
  snoozeCount: number;

  constructor(day: IDay, time: ITime) {
    this.day = day;
    this.time = time;
    this.snoozeCount = 0;
  }

  getTime(): string {
    return `${this.day} at ${this.time.hours}:${this.time.minutes}`;
  }

  resetSnooze(): void {
    this.snoozeCount = 0;
  }

  snooze(): void {
    if (this.snoozeCount < 3) {
      this.snoozeCount++;
      console.log(
        `Snoozed ${this.getTime()}, snoozeCount ${this.snoozeCount} time(s)`
      );
    } else {
      console.log("Maximum snooze count reached.");
    }
  }
}
