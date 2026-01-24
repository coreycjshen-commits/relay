import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowRight, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile with athlete info
    const { data: profile } = await supabase
        .from('users')
        .select('*, athlete_profiles(*)')
        .eq('id', user.id)
        .single()

    // Fetch recent requests (sent)
    const { data: sentRequests } = await supabase
        .from('requests')
        .select('id, request_type, status, created_at')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

    // Fetch pending requests to respond to
    const { data: pendingRequests } = await supabase
        .from('requests')
        .select('id, request_type, context, users:requester_id(name)')
        .neq('requester_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(3)

    // Count stats
    const { count: totalSent } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('requester_id', user.id)

    const { count: totalAccepted } = await supabase
        .from('responses')
        .select('*', { count: 'exact', head: true })
        .eq('responder_id', user.id)
        .eq('response_type', 'accept')

    const isVerified = profile?.athlete_profiles?.verification_status

    return (
        <div className="container mx-auto p-4 space-y-8 animate-fade-in">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-heading-1 text-primary">
                        Welcome back, {profile?.name?.split(' ')[0] || 'Athlete'}
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        {profile?.role === 'student' ? 'Student-Athlete' : 'Alumni'}
                        {isVerified && (
                            <Badge variant="success" className="ml-2">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                            </Badge>
                        )}
                    </p>
                </div>
                <Link href="/requests/new">
                    <Button variant="secondary" className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Request
                    </Button>
                </Link>
            </header>

            {/* Verification Banner */}
            {!isVerified && (
                <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900">
                    <CardContent className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                                <p className="font-medium text-yellow-800 dark:text-yellow-200">Complete Your Verification</p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">Verified athletes get higher response rates and unlock all features.</p>
                            </div>
                        </div>
                        <Link href="/profile/verify">
                            <Button size="sm">Verify Now</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-primary">{totalSent || 0}</div>
                        <p className="text-sm text-muted-foreground">Requests Sent</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-secondary">{totalAccepted || 0}</div>
                        <p className="text-sm text-muted-foreground">Athletes Helped</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-accent">{pendingRequests?.length || 0}</div>
                        <p className="text-sm text-muted-foreground">Pending to Review</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            {profile?.premium_status ? (
                                <Badge variant="success">Premium</Badge>
                            ) : (
                                <Badge variant="outline">Free</Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Account Status</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* My Recent Requests */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>My Requests</CardTitle>
                            <CardDescription>Your recent outreach</CardDescription>
                        </div>
                        <Link href="/requests">
                            <Button variant="ghost" size="sm" className="gap-1">
                                View All <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {(!sentRequests || sentRequests.length === 0) ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">No requests yet</p>
                                <Link href="/requests/new">
                                    <Button variant="outline" size="sm">Create Your First Request</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sentRequests.map((req) => (
                                    <Link key={req.id} href={`/requests/${req.id}`} className="block">
                                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                                            <div className="flex items-center gap-3">
                                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium capitalize">{req.request_type}</span>
                                            </div>
                                            <Badge variant={req.status === 'pending' ? 'warning' : req.status === 'accepted' ? 'success' : 'outline'}>
                                                {req.status}
                                            </Badge>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Requests to Review */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Help Fellow Athletes</CardTitle>
                            <CardDescription>Requests waiting for you</CardDescription>
                        </div>
                        <Link href="/requests">
                            <Button variant="ghost" size="sm" className="gap-1">
                                View All <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {(!pendingRequests || pendingRequests.length === 0) ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No pending requests to review</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pendingRequests.map((req: { id: string; request_type: string; context: string; users: Array<{ name: string }> | null }) => (
                                    <Link key={req.id} href={`/requests/${req.id}`} className="block">
                                        <div className="p-3 rounded-lg border hover:border-secondary transition-colors">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium capitalize">{req.request_type}</span>
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {req.users?.[0]?.name || 'Anonymous'} is looking for help
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

