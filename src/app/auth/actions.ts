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

    const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                role,
            }
        }
    })

    // We should also initialize the user record in our public.users table via a trigger or manually here.
    // For simplicity assuming trigger exists or doing it here if trigger fails/not set up.
    // Actually, let's trust Supabase Auth -> public.users trigger if I had one, 
    // but since I didn't write a trigger in the migration, I must insert it manually.

    if (signUpError) {
        return redirect(`/signup?error=${signUpError.message}`)
    }

    // Note: We can't insert into public.users here easily because we don't know the ID yet if email confirmation is on. 
    // However, `signUp` returns session/user if auto-confirm is on or just user if not.
    // Let's rely on a trigger I will ADD to the database to ensure data integrity.

    revalidatePath('/', 'layout')
    redirect('/login?message=Check email to continue sign in process')
}
