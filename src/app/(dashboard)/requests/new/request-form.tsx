import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { refineRequestDraft, submitRequest } from './actions'
import { Wand2 } from 'lucide-react'

interface Recipient {
    id: string
    name: string
    sport: string
    school: string
    role: string
    imageUrl?: string
}

export function RequestForm({ recipient }: { recipient?: Recipient }) {
    const [context, setContext] = useState('')
    const [offer, setOffer] = useState('')
    const [isRefining, setIsRefining] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleRefine = async () => {
        if (!context && !offer) return;

        setIsRefining(true)
        try {
            const result = await refineRequestDraft(context, offer)
            setContext(result.refinedContext)
            setOffer(result.refinedOffer)
        } finally {
            setIsRefining(false)
        }
    }

    const handleSubmit = async (_formData: FormData) => {
        setIsSubmitting(true)
        try {
            await submitRequest()
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {recipient && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 mb-2">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                        <AvatarImage src={recipient.imageUrl} alt={recipient.name} />
                        <AvatarFallback>
                            {recipient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="text-sm font-semibold text-foreground">
                            Requesting help from {recipient.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {recipient.sport} • {recipient.school} • {recipient.role}
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    {recipient ? `What kind of help are you asking ${recipient.name.split(' ')[0]} for?` : "Request Type"}
                </label>
                <Select name="type" required>
                    <option value="">Select a request type...</option>
                    <option value="advice">Career Advice</option>
                    <option value="internship">Internship Opportunity</option>
                    <option value="fulltime">Full-time Role</option>
                    <option value="referral">Referral</option>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">
                    {recipient ? `Tell ${recipient.name.split(' ')[0]} why you're reaching out` : "Context"}
                </label>
                <Textarea
                    name="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder={recipient ? `Hi ${recipient.name.split(' ')[0]}, I'm a fellow student-athlete interested in...` : "e.g. D1 Swimmer, Junior year at Stanford, looking to break into finance..."}
                    showCount
                    maxLength={500}
                    required
                />
                <p className="text-xs text-muted-foreground">This is a personal 1-to-1 message. Mention shared values or sports background.</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Time Commitment</label>
                <Select name="time_commitment" required>
                    <option value="">How much of their time are you asking for?</option>
                    <option value="15min">15 minute call</option>
                    <option value="30min">30 minute call</option>
                    <option value="email">Email exchange</option>
                    <option value="review">Resume/document review</option>
                    <option value="ongoing">Ongoing mentorship</option>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">What You Offer in Return</label>
                <Input
                    name="offer"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    placeholder="e.g. I'll send a follow-up summary, share my network, or update you on my progress..."
                    required
                />
                <p className="text-xs text-muted-foreground">Reciprocity builds trust. How will you show appreciation?</p>
            </div>

            {/* AI Assist Section */}
            <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium flex items-center gap-2">
                            <Wand2 className="h-4 w-4 text-secondary" />
                            AI Writing Assistant
                        </p>
                        <p className="text-xs text-muted-foreground">Improve clarity and professionalism</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={handleRefine}
                        disabled={isRefining || (!context && !offer)}
                        loading={isRefining}
                    >
                        {isRefining ? "Refining..." : "Refine Draft"}
                    </Button>
                </div>
            </div>

            <input type="hidden" name="recipient_id" value={recipient?.id || ""} />
            <input type="hidden" name="ai_assisted" value={isRefining ? "true" : "false"} />

            <Button className="w-full" type="submit" loading={isSubmitting} size="lg">
                {isSubmitting ? "Sending..." : "Send Personal Request"}
            </Button>

            <p className="text-xs text-center text-muted-foreground italic">
                {recipient ? `Only ${recipient.name} will see this request.` : "Requests expire after 7 days if not responded to."}
            </p>
        </form>
    )
}

