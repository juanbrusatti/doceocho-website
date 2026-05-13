'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

const SECRET_KEY = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET || 'your-secret-key-change-this-in-production')

export async function loginAdmin(formData: { username: string; password: string }) {
  try {
    // Validate input
    const { username, password } = loginSchema.parse(formData)

    // Validate against hardcoded credentials
    if (username !== 'doceocho' || password !== 'DoceOcho12/8') {
      return {
        success: false,
        error: 'Invalid credentials',
      }
    }

    // Create JWT token
    const token = await new SignJWT({ username, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET_KEY)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return {
      success: true,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input',
      }
    }

    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-session')?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload
  } catch {
    return null
  }
}
