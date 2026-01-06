import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db/mongoose";
import Admin from "@/lib/db/models/Admin";

/** @type {import("next-auth").NextAuthOptions} */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();

        const admin = await Admin.findOne({ email: credentials.email });

        if (!admin) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await admin.comparePassword(
          credentials.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: admin._id.toString(),
          email: admin.email,
          name: admin.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set in environment variables");
}
