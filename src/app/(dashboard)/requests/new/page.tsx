import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { RequestForm } from "./request-form"

export default function NewRequestPage() {
    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Create New Request</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <RequestForm />
                </CardContent>
            </Card>
        </div>
    )
}
