'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, ShieldCheck, MapPin } from "lucide-react"
import Link from "next/link"

interface ProfileHeaderProps {
    profile: any
    isOwnProfile: boolean
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
    return (
        <Card className="rounded-2xl overflow-hidden border-none shadow-sm bg-white dark:bg-card">
            {/* Banner Image */}
            <div className="h-40 md:h-52 bg-gradient-to-r from-blue-100 to-cyan-100 relative">
                {isOwnProfile && (
                    <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-4 right-4 text-primary/70 hover:text-primary hover:bg-white/50"
                    >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Theme
                    </Button>
                )}
            </div>

            <CardContent className="px-6 pb-8 relative -mt-16 flex flex-col items-center text-center">
                {/* Profile Picture */}
                <div className="relative">
                    <Avatar className="h-32 w-32 border-[6px] border-white shadow-md">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback className="text-4xl bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                            {profile?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    {/* Edit Action */}
                    {isOwnProfile && (
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-sm border border-white"
                        >
                            <Pencil className="h-3 w-3" />
                        </Button>
                    )}
                </div>

                {/* Profile Info */}
                <div className="mt-4 space-y-2 max-w-2xl">
                    <div className="flex items-center justify-center gap-2">
                        <h1 className="text-3xl font-bold text-foreground">
                            {profile?.name}
                        </h1>
                        {profile?.athlete_profiles?.verification_status && (
                            <ShieldCheck className="h-6 w-6 text-blue-500" />
                        )}
                    </div>

                    <p className="text-lg font-medium text-foreground/80">
                        {profile?.athlete_profiles?.sport ? `${profile.athlete_profiles.sport} Student-Athlete` : 'Student-Athlete'} at {profile?.athlete_profiles?.school || 'University'}
                    </p>

                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            Los Angeles, CA
                        </span>
                        <span>•</span>
                        <span className="font-medium text-primary">500+ Connections</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-3 mt-6 pt-2">
                        <Button className="rounded-full px-8 shadow-md hover:shadow-lg transition-all">
                            Connect
                        </Button>
                        <Button variant="outline" className="rounded-full px-6">
                            View Resume
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <div className="sr-only">More options</div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
