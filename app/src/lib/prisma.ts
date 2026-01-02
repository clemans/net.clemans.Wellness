import dotenv from "dotenv";
dotenv.config({ path: ".env_db" });

import { PrismaClient } from "@prisma/client";


declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

export const prisma =
    global.prisma ??
    new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
        log: ["error", "warn"]
    });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;