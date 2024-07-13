import * as p from "@clack/prompts";
import moment, { Moment } from "moment";
import { Alarm } from "./Alarm";
import { IDay, ITime } from "./types";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export class AlarmClock {
  private alarms: Alarm[] = [];

  addAlarm(day: IDay, time: ITime): void {
    this.alarms.push(new Alarm(day, time));
    console.log(`Alarm set for ${day} at ${time.hours}:${time.minutes}:`);
  }

  async setAlarm() {
    const now = moment();
    const group = await p.group<any>(
      {
        time: () =>
          p.text({
            message: "What time in HH:MM format?",
            placeholder: "HH:MM",
            initialValue: `${now.get("hours")}:${now.get("minutes")}`,
            validate: (input) =>
              new RegExp(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).test(input)
                ? undefined
                : "Invalid time format. Please try again.",
          }),
        day: ({ results }) => {
          console.log(results);
          return p.select({
            message: `Select day`,
            options: days.map((day) => ({ value: day, label: day })),
          });
        },
      },
      {
        // On Cancel callback that wraps the group
        // So if the user cancels one of the prompts in the group this function will be called
        onCancel: ({ results }) => {
          p.cancel("Operation cancelled.");
          process.exit(0);
        },
      }
    );

    const time = group.time.split(":");
    this.addAlarm(group.day, {
      hours: parseInt(time[0]),
      minutes: parseInt(time[1]),
    });
  }

  async deleteAlarm() {
    // show multi select for deleting alarms
    const selectedOptions = await (p.multiselect({
      message: "Select alarms to delete:",
      options: this.alarms.map((alarm, index) => ({
        value: index,
        label: `${alarm.getTime()} (Snoozed ${alarm.snoozeCount} times)`,
      })),
    }) as Promise<number[]>);
    if (selectedOptions.length === 0) {
      console.log("No alarms selected.");
      return;
    }
    this.alarms = this.alarms.filter(
      (_, index) => !selectedOptions.includes(index)
    );
    console.log("selected alarms deleted.");
    this.checkAlarms();
  }

  displayAlarms(): void {
    if (this.alarms.length == 0) {
      console.log("No alarms found.!");
      return;
    }
    this.alarms.forEach((alarm, index) => {
      console.log(
        `${index + 1}. ${alarm.getTime()} (Snoozed ${alarm.snoozeCount} times)`
      );
    });
  }

  checkAlarms(): void {
    const now = moment();
    this.alarms.forEach((alarm) => {
      if (alarm.day != now.format("dddd")) {
        alarm.resetSnooze();
      } else if (alarm.day == now.format("dddd")) {
        const dt = moment(`${alarm.time.hours}:${alarm.time.minutes}`, "HH:mm");
        if (alarm.snoozeCount < 3) {
          dt.add(5 * alarm.snoozeCount - 1, "minutes");
        }
        if (dt.isBefore(now)) {
          console.log(`Alarm! at ${alarm.getTime()}`);
        }
      }
    });
  }

  async snoozeAlarm() {
    // prompt user to snooze alarm
    const selectedIndex = await (p.select({
      message: "Select an alarm to snooze:",
      options: this.alarms.map((alarm, index) => ({
        value: index,
        label: `${alarm.getTime()} (Snoozed ${alarm.snoozeCount} times)`,
      })),
    }) as Promise<number | null>);
    if (selectedIndex === null) {
      console.log("No alarms selected.");
      return;
    }
    this.alarms[selectedIndex].snooze();
  }
}
