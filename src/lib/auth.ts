import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;
        if (!email || !password) return null;

        const sql = getDb();
        const users = await sql`
          SELECT id, email, first_name, last_name, password_hash, status
          FROM users
          WHERE email = ${email.toLowerCase().trim()}
        `;
        const user = users[0];
        if (!user || !user.password_hash) return null;

        const valid = await bcrypt.compare(password, String(user.password_hash));
        if (!valid) return null;

        return {
          id: String(user.id),
          email: String(user.email),
          name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.userId) session.user.id = token.userId as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
