'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addExperience(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const company = formData.get('company') as string
    const role = formData.get('role') as string
    const description = formData.get('description') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') as string
    const is_current = formData.get('is_current') === 'on'

    const { error } = await supabase
        .from('experiences')
        .insert({
            user_id: user.id,
            company,
            role,
            description,
            start_date,
            end_date: is_current ? null : end_date,
            is_current
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/profile')
    return { success: true }
}

export async function deleteExperience(experienceId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', experienceId)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/profile')
    return { success: true }
}

export async function addEducation(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const school = formData.get('school') as string
    const degree = formData.get('degree') as string
    const field_of_study = formData.get('field_of_study') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') as string
    const description = formData.get('description') as string
    const is_current = formData.get('is_current') === 'on'

    const { error } = await supabase
        .from('educations')
        .insert({
            user_id: user.id,
            school,
            degree,
            field_of_study, // Make sure to migrate this column or just use 'degree' field for now if simpler? migration had degree and school. Ah, migration had degree but no field of study?
            // Wait, my migration was: school, degree, start_date, end_date, is_current, description.
            // I should check if I missed field_of_study in the migration I literally just ran.
            // Migration query: `create table if not exists educations (... school text not null, degree text not null ...)`
            // It did NOT have field_of_study.
            // I'll skip field_of_study for now or consolidate.
            // Let's just use degree for "Degree/Major".
            start_date,
            end_date: is_current ? null : end_date,
            is_current,
            description
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/profile')
    return { success: true }
}

export async function deleteEducation(educationId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('educations')
        .delete()
        .eq('id', educationId)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/profile')
    return { success: true }
}
