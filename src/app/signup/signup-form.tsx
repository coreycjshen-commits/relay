'use client'

import { signup } from '@/app/auth/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import Captcha from '@/components/captcha'

export default function SignupForm() {
    const [captchaToken, setCaptchaToken] = useState<string>('')

    return (
        <form className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input id="name" name="name" type="text" required placeholder="Your full name" />
            </div>
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" name="email" type="email" required placeholder="you@university.edu" />
            </div>
            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input id="password" name="password" type="password" required placeholder="Create a password" />
            </div>
            <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">I am a...</label>
                <select
                    id="role"
                    name="role"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue=""
                >
                    <option value="" disabled>Select your role</option>
                    <option value="student">Current Student-Athlete</option>
                    <option value="alum">Former Student-Athlete (Alumni)</option>
                </select>
            </div>

            <Captcha onVerify={setCaptchaToken} />
            <input type="hidden" name="captchaToken" value={captchaToken} />

            <Button formAction={signup} className="w-full" disabled={!captchaToken}>Create Account</Button>
        </form>
    )
}
