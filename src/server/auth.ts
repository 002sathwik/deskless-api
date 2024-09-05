/* eslint-disable */
import { PrismaAdapter } from "@auth/prisma-adapter";
import { User, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";
import { login } from "~/services/auth.service";
import { getUserByEmail } from "~/utils/auth/auth";
import {
  getRefreshTokenExpiry,
  isJwtExpired,
  rotateTokens,
} from "~/utils/auth/jwt";
import { loginZ } from "~/zod/authZ";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
    id: number;
    usn: string;
    name: string;
    email: string;
    role: Role;
  }

  interface AdapterUser {
    accessToken: string;
    refreshToken: string;
    id: number;
    usn: string;
    name: string;
    email: string;
    role: Role;
  }

  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
      usn: string;
      role: Role;
      accessToken: string;
      refreshToken: string;
    };
    accessToken: string;
  }
}
declare module "next-auth/jwt" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface JWT {
    id: number;
    name: string;
    email: string;
    role: Role;
    usn: string;
    iat: number;
    exp: number;
    accessToken: string;
    refreshToken: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user, trigger, session }): Promise<any> {
      if (!token.sub) return token;
      if (user && trigger === "signIn") {
        token = {
          ...token,
          sub: user.id as unknown as string,
          name: user.name,
          email: user.email,
          role: user.role,
          usn: user.usn,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          iat: Math.floor(Date.now() / 1000),
          exp: getRefreshTokenExpiry(user.refreshToken),
        };
        return token;
      }

      if (trigger === "update" && session) {
        token = {
          ...token,
          accessToken: session.accessToken,
        };
        return token;
      }

      if (isJwtExpired(String(token.accessToken))) {
        const [newAccessToken, newRefreshToken] = await rotateTokens(
          String(token.refreshToken),
        );
        if (newAccessToken && newRefreshToken) {
          token = {
            ...token,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            exp: getRefreshTokenExpiry(newRefreshToken),
          };
          if (token.accessToken === newAccessToken) return token;
        }
        return null;
      }

      return token;
    },
    async session({ session, token, trigger }) {
      if (token.sub && session.user) {
        session.user.id = parseInt(token.sub);
        session.user.name = token.name;
        session.user.usn = token.usn;
        session.user.email = token.email;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials: any, req: any): Promise<any> {
        const validateFields = loginZ.safeParse(credentials);
        if (!validateFields.success) return null;
        const { email, password } = validateFields.data;
        const data = await login({ email, password });
        if (!data) return null;
        const { accessToken, refreshToken } = data;
        const existingUser: User | null = await getUserByEmail(email);
        if (!existingUser) return null;
        const passwordMatch = await bcrypt.compare(
          password,
          existingUser.password,
        );
        if (!passwordMatch) return null;
        const user = {
          ...existingUser,
          refreshToken: refreshToken,
          accessToken: accessToken,
        };
        return user;
      },
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
