import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from 'next/link'

export default function CheckEmailPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">Check Your Email</CardTitle>
                    <CardDescription>
                        We&apos;ve sent a confirmation link to your email address.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Click the link in your email to verify your account and complete signup.
                        If you don&apos;t see the email, check your spam folder.
                    </p>
                    <div className="pt-4 border-t">
                        <p className="text-xs text-muted-foreground mb-2">
                            Already confirmed?
                        </p>
                        <Link href="/login">
                            <Button variant="outline" className="w-full">Go to Login</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
