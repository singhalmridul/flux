import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"

import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import AppleProvider from "next-auth/providers/apple"

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: { strategy: "jwt" },
    adapter: PrismaAdapter(db),
    providers: [


        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID,
            clientSecret: process.env.APPLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        // Kept for development ease, but should likely be removed in strict production
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "mridul" },
            },
            async authorize(credentials) {
                const user = { id: "cmj664c460000giquv22tnbu7", name: "Mridul S.", email: "mridul@flux.os" }
                return user
            },
        }),

    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
    }
})
