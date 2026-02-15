import { signup } from '@/app/auth/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import Link from 'next/link'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = await searchParams

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Join the Team</CardTitle>
                    <CardDescription>
                        Create your Relay account to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {params.error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                            {params.error}
                        </div>
                    )}
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                            <Input id="name" name="name" type="text" required placeholder="Your full name" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input id="email" name="email" type="email" required placeholder="you@university.edu" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">Password</label>
                            <Input id="password" name="password" type="password" required placeholder="Create a password" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="role" className="text-sm font-medium">I am a...</label>
                            <select
                                id="role"
                                name="role"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                defaultValue=""
                            >
                                <option value="" disabled>Select your role</option>
                                <option value="student">Current Student-Athlete</option>
                                <option value="alum">Former Student-Athlete (Alumni)</option>
                            </select>
                        </div>
                        <Button formAction={signup} className="w-full">Create Account</Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/login" className="text-secondary hover:underline font-medium">Sign In</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
