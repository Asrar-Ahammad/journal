import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@luminae.app" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials.email === "demo@luminae.app" && credentials.password === "demo123") {
          return { id: "1", name: "Demo User", email: "demo@luminae.app" }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.AUTH_SECRET || "dummy_secret_for_local_dev_123456",
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isDashboard = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/journal')
      if (isDashboard) {
        if (isLoggedIn) return true
        return false // Redirect to signIn
      }
      return true
    }
  }
})
