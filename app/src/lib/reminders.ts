import cron from "node-cron";
import { prisma } from "./prisma.js";
import { sendEmail } from "./ses.js";

function todayMidnightUTC(): Date {
    const now = new Date();
    const utc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    return utc;
}

async function sendReminder(userId: string, email: string, type: "MIDDAY" | "NIGHT", subject: string, body: string) {
    try {
        await sendEmail(email, subject, body);
        await prisma.reminderLog.create({ data: { userId, type, success: true } });
    } catch (e: any) {
        await prisma.reminderLog.create({ data: { userId, type, success: false, info: String(e) } });
    }
}

export function startReminders() {
    // Midday reminder if no entry exists for today
    cron.schedule(process.env.REMINDER_MIDDAY_CRON || "0 12 * * *", async () => {
        const users = await prisma.user.findMany();
        const date = todayMidnightUTC();

        for (const u of users) {
            const entry = await prisma.entry.findFirst({ where: { userId: u.id, date } });
            if (!entry) {
                await sendReminder(u.id, u.email, "MIDDAY", "Midday check-in",
                    "Quick log link: https://wellness.clemans.net/log");
            }
        }
    });

    // Nightly reminder if entry missing or looks incomplete
    cron.schedule(process.env.REMINDER_NIGHT_CRON || "0 21 * * *", async () => {
        const users = await prisma.user.findMany();
        const date = todayMidnightUTC();

        for (const u of users) {
            const entry = await prisma.entry.findFirst({ where: { userId: u.id, date } });
            const incomplete = 
            !entry ||
            !entry.metrics ||
            Object.keys(entry.metrics as Record<string, unknown>).length < 5;

            if (incomplete) {
                await sendReminder(u.id, u.email, "NIGHT", "Nightly reminder",
                    "Finish today's entry: https://wellness.clemans.net/log");
            }
        }
    });
}