'use server'

import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function loginWithEmail(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return {
                success: false,
                error: error.message,
            }
        }

        // Simpan token ke cookies
        if (data.session) {
            const cookieStore = await cookies();
            cookieStore.set('sb-access-token', data.session.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 hari
            })
            // Simpan email ke cookies
            cookieStore.set('user-email', email, {
                httpOnly: false, // Bisa diakses dari client
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 hari
            })
        }

        return {
            success: true,
            data,
        }
    } catch (error) {
        return {
            success: false,
            error: 'Terjadi kesalahan saat login',
        }
    }
}

export async function logout() {
    try {
        await supabase.auth.signOut()
    } catch {
        // Ignore sign out errors on server (no session context)
    }

    const cookieStore = cookies()
    ;(await cookieStore).delete('sb-access-token')
    ;(await cookieStore).delete('user-email')

    redirect('/login')
}