import type { NextAuthOptions } from "next-auth";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

const NextAuth = require("next-auth").default;
const CredentialsProvider = require("next-auth/providers/credentials").default;

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: { email: { label: "Email" }, password: { label: "Password", type: "password" } },
            async authorize(credentials: { email: string; password: any; }) {
                if (!credentials?.email || !credentials?.password) return null;
                const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                if (!user) return null;
                const ok = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!ok) return null;
                return { id: user.id, email: user.email, role: user.role };
            }
        })
    ],
    session: { strategy: "jwt" },
    pages: { signIn: "/login" }
};

export default NextAuth(authOptions);