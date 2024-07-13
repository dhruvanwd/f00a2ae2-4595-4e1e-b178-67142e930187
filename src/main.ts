import { intro, outro, select, isCancel, cancel, text } from "@clack/prompts";
import moment from "moment";
import { AlarmClock } from "./AlarmClock";

intro(`Welcome to the Alart CLI App! ��`);
// Do stuff
const alarmClock = new AlarmClock();

setInterval(() => {
  alarmClock.checkAlarms();
}, 1000);

async function main() {
  const projectType = await select({
    message: "Select option:",
    options: [
      { value: 1, label: "Display Current Time" },
      { value: 2, label: "Set an Alarm" },
      { value: 3, label: "Delete an Alarm", hint: "oh no" },
      { value: 4, label: "Display Alarms" },
      { value: 5, label: "Snooze an Alarm" },
      { value: 6, label: "Exit" },
    ],
  });

  if (isCancel(projectType)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }
  console.log(`Selected option: ${projectType}`);

  switch (projectType) {
    case 1:
      console.log(`Current time is ${moment().format("h:mm:ss a")}.`);
      main();
      break;
    case 2:
      await alarmClock.setAlarm();
      main();
      break;
    case 3:
      await alarmClock.deleteAlarm();
      main();
      break;
    case 4:
      alarmClock.displayAlarms();
      main();
      break;
    case 5:
      await alarmClock.snoozeAlarm();
      main();
      break;
    case 6:
      outro(`Thanks for visit!`);
      process.exit(0);
    default:
      console.log("Invalid option. Please try again.");
      main();
      break;
  }
}
main();
