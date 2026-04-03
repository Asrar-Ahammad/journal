"use client"

import { signIn } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function SignInPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    })
    // NextAuth will handle the redirect, but if it fails we reset loading
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border/60 shadow-lg rounded-2xl bg-card">
        <CardHeader className="space-y-3 text-center pt-8">
          <CardTitle className="text-3xl font-heading font-medium tracking-tight">Sign In to Luminae</CardTitle>
          <CardDescription className="text-base">
            Enter your demo credentials below
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                defaultValue="demo@luminae.app" 
                required 
                className="rounded-xl h-12 bg-background border-border shadow-sm focus-visible:ring-amber-500/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                defaultValue="demo123" 
                required 
                className="rounded-xl h-12 bg-background border-border shadow-sm focus-visible:ring-amber-500/30"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-md font-medium mt-2">
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Signing In...</>
              ) : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-8 text-center bg-muted/50 rounded-xl p-4 border border-border/50">
            <p className="text-sm font-medium text-muted-foreground mb-1">Demo Credentials</p>
            <p className="text-sm tracking-wide"><span className="font-semibold text-foreground">Email:</span> demo@luminae.app</p>
            <p className="text-sm tracking-wide"><span className="font-semibold text-foreground">Pass:</span> demo123</p>
          </div>
        </CardContent>
        <CardFooter className="justify-center pb-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline">
            ← Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
