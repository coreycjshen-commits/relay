import { signup } from '@/app/auth/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import Link from 'next/link'

export default function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Join Relay</CardTitle>
                    <CardDescription>
                        Create your account to connect with fellow athletes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                            <Input id="name" name="name" type="text" required placeholder="Jane Doe" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input id="email" name="email" type="email" required placeholder="jane@university.edu" />
                            <p className="text-xs text-muted-foreground">Use your .edu email for faster verification</p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="role" className="text-sm font-medium">I am a...</label>
                            <Select name="role" id="role" required>
                                <option value="student">Current Student-Athlete</option>
                                <option value="alum">Alum / Former Athlete</option>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">Password</label>
                            <Input id="password" name="password" type="password" required minLength={6} />
                            <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                        </div>

                        <Button formAction={signup} className="w-full">Create Account</Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/login" className="text-secondary hover:underline font-medium">Login</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

