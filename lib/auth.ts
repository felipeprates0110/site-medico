import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { supabaseAdmin } from "./supabase";

const nextAuthSecret =
  process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

if (!nextAuthSecret && process.env.NODE_ENV === "production") {
  console.error(
    "[next-auth] NEXTAUTH_SECRET ausente. Configure esta variável na Vercel."
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Buscar usuário no Supabase
          const { data: user, error } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("email", credentials.email)
            .eq("is_active", true)
            .single();

          if (error || !user) {
            return null;
          }

          // Verificar senha
          const passwordMatch = await compare(
            credentials.password,
            user.password_hash
          );

          if (!passwordMatch) {
            return null;
          }

          // Retornar dados do usuário (sem a senha)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("[next-auth] Erro ao autenticar:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Adicionar informações extras ao token JWT
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Adicionar informações extras à sessão
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: nextAuthSecret,
};

// Tipos estendidos do NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
