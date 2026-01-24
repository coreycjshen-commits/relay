'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { refineRequestDraft, submitRequest } from './actions'
import { Wand2 } from 'lucide-react'

export function RequestForm() {
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

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        try {
            await submitRequest(formData)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Request Type</label>
                <Select name="type" required>
                    <option value="">Select a request type...</option>
                    <option value="advice">Career Advice</option>
                    <option value="internship">Internship Opportunity</option>
                    <option value="fulltime">Full-time Role</option>
                    <option value="referral">Referral</option>
                </Select>
                <p className="text-xs text-muted-foreground">What kind of help are you looking for?</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Context</label>
                <Textarea
                    name="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g. D1 Swimmer, Junior year at Stanford, looking to break into finance. Interested in investment banking at Goldman Sachs..."
                    showCount
                    maxLength={500}
                    required
                />
                <p className="text-xs text-muted-foreground">Include your sport, school, year, and career goals</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Time Commitment</label>
                <Select name="time_commitment" required>
                    <option value="">How much time are you asking for?</option>
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
                    placeholder="e.g. I'll send a follow-up summary of our conversation, update you on outcomes..."
                    required
                />
                <p className="text-xs text-muted-foreground">Reciprocity matters - what value can you provide?</p>
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

            <input type="hidden" name="ai_assisted" value={isRefining ? "true" : "false"} />

            <Button className="w-full" type="submit" loading={isSubmitting} size="lg">
                {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
                Requests expire after 7 days if not responded to
            </p>
        </form>
    )
}

