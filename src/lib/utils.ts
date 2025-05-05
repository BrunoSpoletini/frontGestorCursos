import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { authAPI, userAPI } from "@/api/api"
import { toast } from "sonner"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getUserAuth(router: any, role: string) {
    // Try to get user from localStorage first
    const storedUser = localStorage.getItem("user")
    let userData;
    if (storedUser) {
        userData = JSON.parse(storedUser)
        return userData
    } 

    // If not in localStorage, fetch from API
    const response = await userAPI.getMyUser()

    if (response.status !== 200) {
        toast.error("Failed to fetch user info")
        localStorage.clear()
        router.push("/login")
    }

    userData = response.data
    localStorage.setItem("user", JSON.stringify(userData))

    if (userData.role !== role) {
        toast.error("You are not authorized to access this page")
        localStorage.clear()
        router.push("/login")
    }

    return userData
}
