import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/photoslibrary.readonly",
    }),
  ],
  jwt: {
    secret: "abba",
    encryption: false,
  },
  callbacks: {
    async session(session, user) {
      return session;
    },
    async jwt(token, user, account, profile, isNewUser) {
      return {
        ...token,
        ...account,
      };
    },
  },
});
