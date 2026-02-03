import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function ProfileSidebar() {
    return (
        <div className="space-y-6">
            {/* Profile Link Card */}
            <Card className="bg-white dark:bg-card border-none shadow-sm rounded-xl">
                <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">Public Profile</h3>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted/50 rounded-full">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Share your verified athlete profile with recruiters.</p>
                    <div className="bg-muted/30 p-2 rounded-lg text-sm text-foreground font-mono truncate flex justify-between items-center">
                        <span>relay.com/in/corey-shen</span>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Copy</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Suggested Teammates */}
            <Card className="bg-white dark:bg-card border-none shadow-sm rounded-xl">
                <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-4">Suggested Teammates</h3>
                    <div className="space-y-5">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3 items-center">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 font-medium">AG</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">Angela Guo</h4>
                                    <p className="text-xs text-muted-foreground truncate">Squash at Phillips Academy</p>
                                </div>
                                <Button size="sm" variant="outline" className="rounded-full h-8 px-3 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                                    Connect
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground">
                        View all suggestions
                    </Button>
                </CardContent>
            </Card>

            {/* Relay Pro Promo */}
            <Card className="bg-gradient-to-br from-[#1a1f2c] to-[#2d3748] text-white border-none shadow-lg rounded-xl sticky top-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <CardContent className="p-6 relative z-10">
                    <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                        <span className="text-xl">🚀</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Relay Pro</h3>
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                        Unlock advanced analytics, unlimited requests, and priority support.
                    </p>
                    <Button className="w-full bg-white text-black hover:bg-gray-100 font-semibold rounded-lg shadow-sm">
                        Upgrade Now
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
