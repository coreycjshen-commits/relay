'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in a real app, you might want to validate this with Zod
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect('/login?error=Could not authenticate user')
    }

    revalidatePath('/', 'layout')
    redirect('/requests')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const role = formData.get('role') as 'student' | 'alum'

    // Get the origin for the email redirect URL
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                role,
            },
            emailRedirectTo: `${origin}/auth/callback`,
        }
    })

    if (signUpError) {
        return redirect(`/signup?error=${encodeURIComponent(signUpError.message)}`)
    }

    // Redirect to check-email page instead of login
    redirect('/signup/check-email')
}
