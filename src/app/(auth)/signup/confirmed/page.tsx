import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from 'next/link'

export default function ConfirmedPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Email Confirmed!</CardTitle>
                    <CardDescription>
                        Your email has been verified successfully. You&apos;re now part of the Relay network.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Welcome to the community! Start connecting with fellow athletes and alumni.
                    </p>
                    <div className="flex flex-col gap-2">
                        <Link href="/requests">
                            <Button className="w-full">Go to Dashboard</Button>
                        </Link>
                        <Link href="/network">
                            <Button variant="outline" className="w-full">Explore Network</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
