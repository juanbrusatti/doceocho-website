'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || (() => {
    throw new Error('ADMIN_SESSION_SECRET environment variable is not set. Please set it in your .env.local file.')
  })()
)

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || (() => {
  throw new Error('ADMIN_USERNAME environment variable is not set. Please set it in your .env.local file.')
})()

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (() => {
  throw new Error('ADMIN_PASSWORD environment variable is not set. Please set it in your .env.local file.')
})()

export async function loginAdmin(formData: { username: string; password: string }) {
  try {
    // Validate input
    const { username, password } = loginSchema.parse(formData)

    // Validate against environment variable credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
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

    // Log error for debugging while keeping user message safe
    console.error('Admin login error:', error)

    return {
      success: false,
      error: 'An error occurred during login',
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
