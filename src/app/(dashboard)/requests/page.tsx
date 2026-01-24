import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, ArrowRight } from "lucide-react"

type Request = {
    id: string
    request_type: string
    context: string
    time_commitment: string
    status: string
    created_at: string
    expires_at: string
    requester_id: string
    users?: {
        name: string
        athlete_profiles?: {
            school: string
            sport: string
        }
    }
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'pending':
            return <Badge variant="warning">Pending</Badge>
        case 'accepted':
            return <Badge variant="success">Accepted</Badge>
        case 'declined':
            return <Badge variant="destructive">Declined</Badge>
        case 'referred':
            return <Badge variant="outline">Referred</Badge>
        default:
            return <Badge>{status}</Badge>
    }
}

function getRequestTypeLabel(type: string) {
    switch (type) {
        case 'advice': return 'Career Advice'
        case 'internship': return 'Internship'
        case 'fulltime': return 'Full-time Role'
        case 'referral': return 'Referral'
        default: return type
    }
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

function isExpired(expiresAt: string) {
    return new Date(expiresAt) < new Date()
}

export default async function RequestsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch requests I sent
    const { data: sentRequests } = await supabase
        .from('requests')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false })

    // Fetch requests sent to me (for now, show all pending requests from others)
    // In a production app, this would be based on matching criteria
    const { data: receivedRequests } = await supabase
        .from('requests')
        .select(`
            *,
            users:requester_id (
                name,
                athlete_profiles (school, sport)
            )
        `)
        .neq('requester_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20)

    return (
        <div className="container mx-auto p-4 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-heading-1 text-primary">Requests</h1>
                    <p className="text-muted-foreground">Manage your career requests and responses</p>
                </div>
                <Link href="/requests/new">
                    <Button variant="secondary" className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Request
                    </Button>
                </Link>
            </div>

            {/* My Sent Requests */}
            <section>
                <h2 className="text-heading-2 text-primary mb-4">My Requests</h2>
                {(!sentRequests || sentRequests.length === 0) ? (
                    <Card className="border-dashed">
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground mb-4">You haven&apos;t sent any requests yet.</p>
                            <Link href="/requests/new">
                                <Button variant="outline">Create Your First Request</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {sentRequests.map((request: Request) => (
                            <Card key={request.id} className="hover-lift transition-base">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">
                                                {getRequestTypeLabel(request.request_type)}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-1">
                                                <Clock className="h-3 w-3" />
                                                {request.time_commitment}
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(request.status)}
                                            {isExpired(request.expires_at) && request.status === 'pending' && (
                                                <Badge variant="destructive">Expired</Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {request.context}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground">
                                            Sent {formatDate(request.created_at)}
                                        </span>
                                        <Link href={`/requests/${request.id}`}>
                                            <Button variant="ghost" size="sm" className="gap-1">
                                                View Details <ArrowRight className="h-3 w-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* Requests To Respond To */}
            <section>
                <h2 className="text-heading-2 text-primary mb-4">Requests From Athletes</h2>
                <p className="text-sm text-muted-foreground mb-4">Help fellow athletes by responding to their requests</p>

                {(!receivedRequests || receivedRequests.length === 0) ? (
                    <Card className="border-dashed">
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No pending requests to review right now.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {receivedRequests.map((request: Request) => (
                            <Card key={request.id} className="hover-lift transition-base border-l-4 border-l-secondary">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                {getRequestTypeLabel(request.request_type)}
                                                <Badge variant="outline" className="font-normal">
                                                    {request.users?.athlete_profiles?.sport || 'Athlete'}
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                {request.users?.name} • {request.users?.athlete_profiles?.school}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="warning">Awaiting Response</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {request.context}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {request.time_commitment}
                                        </span>
                                        <Link href={`/requests/${request.id}`}>
                                            <Button variant="secondary" size="sm" className="gap-1">
                                                Respond <ArrowRight className="h-3 w-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

