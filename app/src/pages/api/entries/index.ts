import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prism } from "../../../lib/prisma";

function midnightUTC(d?: string | Date): Date {
    const base = d ? new Date(d) : new Date();
    return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate()));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions as any);
    if (!session?.user?.email) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    switch (req.method) {
        case "GET": {
            const range = (req.query.range as string) || "30d";
            const days = parseInt(range) || 30;
            const since = midnightUTC();
            since.setUTCDate(since.getUTCDate() - days);

            const entries = await prisma.entry.findMany({
                where: { userId: user.id, date: { gte: since } },
                orderBy: { date: "asc" }
            });
        }
        case "POST": {
            const { date, metrics, notes } = req.body;
            const targetDate = midnightUTC(date);

            const entry = await prisma.entry.upsert({
                where: { userId_date: { userId: user.id, date: targetDate } },
                update: { metrics, notes },
                create: { userId: user.id, date: targetDate, metrics, notes }
            });

            return res.json(entry);
        }
        default : {
            return res.status(405).end();
        }
    }
}
