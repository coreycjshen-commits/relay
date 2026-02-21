import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import NetworkClient from "./network-client"

export const dynamic = 'force-dynamic'

type Sport = "Squash" | "Tennis" | "Golf"

interface RealUser {
    id: string
    name: string
    role: string
    school: string
    sport: Sport
    level?: string
    isPlaceholder: false
}

export default async function NetworkPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch all users with their athlete profiles, excluding the current user
    const { data: users, error } = await supabase
        .from('users')
        .select('id, name, email, role, athlete_profiles(sport, school, ncaa_level)')
        .neq('id', user.id)

    if (error) {
        console.error('Error fetching users:', error)
    }

    // Diagnostic logging for development/beta
    console.log(`Fetched ${users?.length || 0} potential users`)
    if (users && users.length > 0) {
        console.log('Sample user profile format:', JSON.stringify(users[0].athlete_profiles))
    }

    // Transform database rows into the format the client component expects
    const realUsers: RealUser[] = (users || [])
        .filter((u: any) => {
            // Flexible check for profile presence (could be array or single object)
            const profiles = u.athlete_profiles
            if (!profiles) return false
            return Array.isArray(profiles) ? profiles.length > 0 : !!profiles
        })
        .map((u: any) => {
            // Support both array and object return formats from Supabase join
            const profiles = u.athlete_profiles
            const profile = Array.isArray(profiles) ? profiles[0] : profiles

            return {
                id: u.id,
                name: u.name || u.email || 'Unknown User',
                role: u.role === 'student' ? 'Student-Athlete' : 'Alumni',
                school: profile?.school || 'Unknown School',
                sport: (profile?.sport || 'Squash') as Sport,
                level: profile?.ncaa_level || undefined,
                isPlaceholder: false as const,
            }
        })

    return (
        <div className="container mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
            <NetworkClient realUsers={realUsers} />

            {/* Debugging info - only visible in beta/development if users aren't showing */}
            {realUsers.length === 0 && (
                <div className="mt-20 p-4 bg-slate-900 text-slate-50 rounded-lg text-xs overflow-auto font-mono opacity-50">
                    <p className="mb-2 font-bold text-red-400">Diagnostic Data (Real users empty):</p>
                    <pre>
                        {JSON.stringify({
                            current_user_id: user.id,
                            query_error: error,
                            total_raw_users: users?.length || 0,
                            raw_users_sample: users?.slice(0, 2)
                        }, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}
