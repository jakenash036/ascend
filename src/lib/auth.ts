import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  // sameSite: "none" required so the cookie is written when the login page
  // is rendered inside a cross-site iframe (ascendescapeaverage.com)
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "none" as const,
        path: "/",
        secure: true,
      },
    },
  },
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
          SELECT id, email, first_name, last_name, password_hash, status, is_admin
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
          isAdmin: Boolean(user.is_admin),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.userId = user.id;
      if (user && "isAdmin" in user) token.isAdmin = (user as { isAdmin?: boolean }).isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token.userId) session.user.id = token.userId as string;
      session.user.isAdmin = token.isAdmin as boolean | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
