'use server'

import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/client'

const contactMessageSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  fileUrls: z.array(z.string()).optional(),
})

export async function saveContactMessage(formData: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  projectType?: string
  message: string
  fileUrls?: string[]
}) {
  try {
    // Validate input
    const validatedData = contactMessageSchema.parse(formData)

    // Insert into Supabase using anon key (public access)
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        project_type: validatedData.projectType || null,
        message: validatedData.message,
        file_urls: validatedData.fileUrls && validatedData.fileUrls.length > 0 ? validatedData.fileUrls : null,
      })

    if (error) {
      console.error('Error saving contact message:', error)
      return {
        success: false,
        error: 'Failed to save message',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input data',
      }
    }

    console.error('Contact message error:', error)
    return {
      success: false,
      error: 'An error occurred while saving the message',
    }
  }
}

export async function getContactMessages() {
  try {
    // Use service role client for admin operations (bypasses RLS), fallback to regular client
    const client = supabaseAdmin || supabase
    const { data, error } = await client
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contact messages:', error)
      return {
        success: false,
        error: 'Failed to fetch messages',
        messages: [],
      }
    }

    return {
      success: true,
      messages: data || [],
    }
  } catch (error) {
    console.error('Contact messages fetch error:', error)
    return {
      success: false,
      error: 'An error occurred',
      messages: [],
    }
  }
}
