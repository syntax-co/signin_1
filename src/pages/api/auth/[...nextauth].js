import NextAuth, {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcryptjs');

const authOptions = {
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            const prisma = new PrismaClient();
            const userName =  credentials.username;
            const password = credentials.password;
            let user = {};

            const result = await prisma.users.findUnique({
              where:{
                user_name:userName
              }
            })
            
            if (result) {
              
              const hash = result.password;
              const check = await bcrypt.compare(password,hash);
              
              
              if (check) {
                user['username'] = userName;
              } else {
                user = null;
              }
              
              return user;
            } else {
              return null
            }
            
          }
        })
      ],
      callbacks: {
        async jwt({ token, user }) {
            user && (token.user = user);
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        },
    },
}


export default NextAuth(authOptions);