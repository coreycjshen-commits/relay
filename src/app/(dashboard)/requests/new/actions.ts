'use server'

export async function refineRequestDraft(context: string, offer: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, this would call OpenAI/Gemini
    // const response = await openai.chat.completions.create({ ... })

    // Mock "AI" Refinement logic
    const refinedContext = `I am a student-athlete specializing in ${context.split(',')[0] || 'my sport'}. Currently, I am focused on translating the discipline and teamwork I learned in athletics into a career in ${context.split('looking for')[1] || 'my field of interest'}.`;

    const refinedOffer = `In return, I would be happy to share insights on the current team culture, offer ${offer || 'my perspective on student-athlete life'}, or pay it forward to future student-athletes.`;

    return {
        refinedContext,
        refinedOffer,
        message: "Draft refined by Relay AI"
    }
}

export async function submitRequest(_formData: FormData) {
    'use server'
    // This would save to Supabase
    // placeholder for now
    await new Promise(resolve => setTimeout(resolve, 500));
    // redirect or return success
}
