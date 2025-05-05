"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'


export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_IP}/api/token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            })

            if (!response.ok) {
                const body = await response.json()

                if ([400, 401].includes(response.status)) {
                    // Handle validation errors
                    const value = Object.values(body)[0]
                    throw new Error(`${value}`);
                } else {
                    throw new Error(body.message || "Failed to login")
                }
            }

            const data = await response.json()

            // Store token or session data
            localStorage.setItem("token", data.access)
            localStorage.setItem("refreshToken", data.refresh)

            // Get user data
            const userResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_IP}/api/my-user/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${data.access}`,
                },
            })

            if (!userResponse.ok) {
                throw new Error("Failed to fetch user data")
            }

            const userData = await userResponse.json()
            localStorage.setItem("user", JSON.stringify(userData))


            // Redirect based on user role
            if (userData.role === "admin") {
                router.push("/admin/dashboard")
            } else if (userData.role === "instructor") {
                router.push("/instructor/dashboard")
            } else if (userData.role === "student") {
                router.push("/student/dashboard")
            } else {
                throw new Error("Unknown user role")
            }

            toast.success("Login successful", {
                description: "Welcome back!",
            })
        } catch (error: any) {
            toast.error("Login failed", { description: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 p-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="username"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <button
                                    type="button"
                                    className="text-sm text-primary hover:underline bg-transparent border-none p-0 m-0 cursor-pointer"
                                    onClick={() => toast.error("That's not implemented yet 😢")}
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 p-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-primary hover:underline">
                                Register
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
