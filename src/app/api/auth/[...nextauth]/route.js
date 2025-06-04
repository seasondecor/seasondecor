import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import BaseRequest from "../../../lib/api/config/Axios-config";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        try {
          const response = await BaseRequest.Post(`/api/Auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          if (!response?.token) {
            throw new Error("Invalid email or password");
          }

          return {
            accessToken: response.token,
            roleId: response.roleId,
            accountId: response.accountId,
          };
        } catch (error) {
          const errorMessage = error?.response?.data?.message || "Invalid email or password";
        //  console.error("Login error:", errorMessage);
          throw new Error(errorMessage);
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      try {
        if (user) {
          // Credentials login
          token.accessToken = user.accessToken;
          token.roleId = user.roleId;
          token.accountId = user.accountId;
          token.error = null;
        }

        if (account?.id_token) {
          // Google login
          try {
            const response = await BaseRequest.Post("/api/Auth/google-login", {
              idToken: account.id_token,
            });

            if (!response?.token) {
              throw new Error("Google login failed");
            }

            token.accessToken = response.token;
            token.roleId = response.roleId;
            token.accountId = response.accountId;
            token.error = null;
          } catch (error) {
            console.error("Google login error:", error);
            token.error = "Google login failed";
          }
        }
      } catch (error) {
        console.error("JWT Callback Error:", error);
        token.error = error.message;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.roleId = token.roleId;
      session.accountId = token.accountId;
      session.error = token.error;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
