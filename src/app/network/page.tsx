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
    const { data: users } = await supabase
        .from('users')
        .select('id, name, email, role, athlete_profiles(sport, school, ncaa_level)')
        .neq('id', user.id)

    // Transform database rows into the format the client component expects
    const realUsers: RealUser[] = (users || [])
        .filter((u) => u.athlete_profiles && u.athlete_profiles.length > 0)
        .map((u) => {
            const profile = u.athlete_profiles![0]
            return {
                id: u.id,
                name: u.name || u.email || 'Unknown User',
                role: u.role === 'student' ? 'Student-Athlete' : 'Alumni',
                school: profile.school || 'Unknown School',
                sport: (profile.sport || 'Squash') as Sport,
                level: profile.ncaa_level || undefined,
                isPlaceholder: false as const,
            }
        })

    return (
        <div className="container mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
            <NetworkClient realUsers={realUsers} />
        </div>
    )
}
