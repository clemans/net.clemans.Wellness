import { startReminders } from "./lib/reminders";

console.log("Starting reminder worker...");
startReminders();

// Keep process alive
process.stdin.resume();