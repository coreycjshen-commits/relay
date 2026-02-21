"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, UserPlus, Check, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { RequestForm } from "@/app/(dashboard)/requests/new/request-form"

type Sport = "Squash" | "Tennis" | "Golf"

interface NetworkPerson {
    id: string
    name: string
    role: string
    school: string
    sport: Sport
    level?: string
    imageUrl?: string
    mutuals?: number
    isPlaceholder?: boolean
}

const PLACEHOLDER_PEOPLE: NetworkPerson[] = [
    {
        id: "placeholder-1",
        name: "Alex Rivera",
        role: "Management Consultant",
        school: "Yale University",
        sport: "Squash",
        level: "Varsity",
        mutuals: 12,
        isPlaceholder: true,
    },
    {
        id: "placeholder-2",
        name: "Jordan Lee",
        role: "Software Engineer",
        school: "Stanford",
        sport: "Tennis",
        level: "D1",
        mutuals: 8,
        isPlaceholder: true,
    },
    {
        id: "placeholder-3",
        name: "Casey Chen",
        role: "Financial Analyst",
        school: "Harvard",
        sport: "Golf",
        level: "Club",
        mutuals: 4,
        isPlaceholder: true,
    },
    {
        id: "placeholder-4",
        name: "Morgan Smith",
        role: "Product Manager",
        school: "Princeton",
        sport: "Squash",
        level: "Amateur",
        mutuals: 15,
        isPlaceholder: true,
    },
    {
        id: "placeholder-5",
        name: "Taylor Kim",
        role: "Venture Capital",
        school: "Wharton",
        sport: "Golf",
        level: "Varsity",
        mutuals: 22,
        isPlaceholder: true,
    },
    {
        id: "placeholder-6",
        name: "Jamie Park",
        role: "Founder",
        school: "MIT",
        sport: "Tennis",
        level: "Club",
        mutuals: 7,
        isPlaceholder: true,
    },
    {
        id: "placeholder-7",
        name: "Drew Davis",
        role: "Lawyer",
        school: "Columbia",
        sport: "Squash",
        level: "Pro",
        mutuals: 3,
        isPlaceholder: true,
    },
    {
        id: "placeholder-8",
        name: "Sam Wilson",
        role: "Doctor",
        school: "Duke",
        sport: "Tennis",
        level: "Varsity",
        mutuals: 9,
        isPlaceholder: true,
    },
    {
        id: "placeholder-9",
        name: "Riley Green",
        role: "Architect",
        school: "Cornell",
        sport: "Golf",
        level: "Amateur",
        mutuals: 5,
        isPlaceholder: true,
    },
]

interface NetworkClientProps {
    realUsers: NetworkPerson[]
}

export default function NetworkClient({ realUsers }: NetworkClientProps) {
    const [filter, setFilter] = useState<Sport | "All">("All")
    const [searchQuery, setSearchQuery] = useState("")
    const [connected] = useState<Set<string>>(new Set())
    const [selectedPerson, setSelectedPerson] = useState<NetworkPerson | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Combine real users (shown first) with placeholders
    const allPeople = [...realUsers, ...PLACEHOLDER_PEOPLE]

    const filteredPeople = allPeople.filter((person) => {
        const matchesSport = filter === "All" || person.sport === filter
        const matchesSearch =
            searchQuery === "" ||
            person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            person.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
            person.role.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSport && matchesSearch
    })

    const handleConnectClick = (person: NetworkPerson) => {
        if (connected.has(person.id)) return
        setSelectedPerson(person)
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Network</h1>
                    <p className="text-muted-foreground mt-1">
                        Discover and connect with people in your sports community.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search people..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {realUsers.length === 0 && (
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex items-start gap-3">
                    <div className="mt-0.5">
                        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/20 text-primary">
                            <span className="text-xs font-bold">i</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-foreground">Welcome to the Relay Beta!</h3>
                        <p className="text-sm text-muted-foreground mt-1">The profiles below are placeholders to demonstrate network functionality while we onboard our first cohort.</p>
                    </div>
                </div>
            )}

            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {(["All", "Squash", "Tennis", "Golf"] as const).map((sport) => (
                    <Button
                        key={sport}
                        variant={filter === sport ? "default" : "outline"}
                        onClick={() => setFilter(sport)}
                        className="rounded-full px-6 transition-all"
                    >
                        {sport}
                    </Button>
                ))}
            </div>

            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {filteredPeople.map((person) => (
                        <motion.div
                            key={person.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="h-full hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                                        <AvatarImage src={person.imageUrl} alt={person.name} />
                                        <AvatarFallback className="text-lg">
                                            {person.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {person.name}
                                            {person.isPlaceholder && (
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-muted text-muted-foreground hidden sm:inline-flex">Placeholder</Badge>
                                            )}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-1">
                                            {person.role}
                                        </CardDescription>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {person.school}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge
                                            variant="default"
                                            className="bg-primary/10 text-primary hover:bg-primary/20"
                                        >
                                            {person.sport}
                                        </Badge>
                                        {person.level && (
                                            <Badge variant="outline">{person.level}</Badge>
                                        )}
                                        {person.mutuals && (
                                            <span className="text-xs text-muted-foreground self-center">
                                                {person.mutuals} mutual connections
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-4">
                                    <Button
                                        className="w-full transition-all"
                                        variant={connected.has(person.id) ? "outline" : "default"}
                                        onClick={() => handleConnectClick(person)}
                                        disabled={connected.has(person.id)}
                                    >
                                        {connected.has(person.id) ? (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                Request Sent
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="mr-2 h-4 w-4" />
                                                Connect
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredPeople.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">No people found in this category.</p>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Start a Connection</DialogTitle>
                        <DialogDescription>
                            Direct your request to {selectedPerson?.name}. This helps set context and improves response rates.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPerson && (
                        <RequestForm
                            recipient={{
                                id: selectedPerson.id,
                                name: selectedPerson.name,
                                sport: selectedPerson.sport,
                                school: selectedPerson.school,
                                role: selectedPerson.role,
                                imageUrl: selectedPerson.imageUrl
                            }}
                            onSuccess={() => setIsDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
