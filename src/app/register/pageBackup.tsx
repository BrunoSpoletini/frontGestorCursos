"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { Terminal } from "lucide-react"
import { Toaster, toast } from 'sonner'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"


const formSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(8).max(50),
    confirmPassword: z.string().min(8).max(50),
    role: z.enum(['student', 'instructor', 'admin']),
})

function roleSelect() {
    return (
        <Select>
            <FormItem>
                <FormLabel>Role</FormLabel>
                <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
            </FormItem>
        </Select>
    )
}

function PostResponseAlert({ error }: { error: any }) {
    if (error?.response != null) {
        return (
            <div className="space-y-4 w-full max-w-96">
                {Object.entries(error.response?.data).map(([key, value]) => (
                    <Alert variant="destructive" key={key}>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>{key[0].toUpperCase() + key.substring(1) + " error"}</AlertTitle>
                        <AlertDescription>
                            {Array.isArray(value) ? value.join(", ") : value.toString()}
                        </AlertDescription>
                    </Alert>
                ))}
            </div>
        );
    }
    return null
}

export function ProfileForm() {
    const router = useRouter()
    const [postError, setError] = useState(null);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "bruno",
            password: "asdasdasd",
            confirmPassword: "asdasdasd",
            role: undefined,
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        if (values.password !== values.confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            if (!values.role) {
                toast.error('Please select a role');
            } else {

                axios.post('http://127.0.0.1:8000/api/register/', values)
                    .then((response) => {
                        console.log("Exito: ", response.data);
                        setError(null);
                    })
                    .catch((error) => {
                        console.log("Error:", error);
                        setError(error);
                    })
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-4 w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-8 rounded-md shadow-md w-full max-w-96">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="user" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            roleSelect()
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
            <PostResponseAlert error={postError} />
        </div>
    )
}

function displayPage() {
    return (
        <div className="flex flex-row justify-center items-center bg-black h-screen w-screen">
            <ProfileForm />
        </div>
    )
}



export default displayPage;

