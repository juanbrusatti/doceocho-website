'use server'

import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/actions/admin-auth'
import type { TestimonialPhrase, Testimonial } from '@/types/testimonials'

const testimonialPhraseSchema = z.object({
  quote: z.string().min(1, 'Quote is required'),
  emphasis: z.boolean(),
  order_index: z.number().int().min(0),
})

const testimonialPhraseUpdateSchema = z.object({
  id: z.string().uuid('Invalid ID'),
  quote: z.string().min(1, 'Quote is required'),
  emphasis: z.boolean(),
  order_index: z.number().int().min(0),
})

const testimonialSchema = z.object({
  quote: z.string().min(1, 'Quote is required'),
  author: z.string().min(1, 'Author is required'),
  role: z.string().min(1, 'Role is required'),
  order_index: z.number().int().min(0),
})

const testimonialUpdateSchema = z.object({
  id: z.string().uuid('Invalid ID'),
  quote: z.string().min(1, 'Quote is required'),
  author: z.string().min(1, 'Author is required'),
  role: z.string().min(1, 'Role is required'),
  order_index: z.number().int().min(0),
})

export async function getTestimonialPhrases(): Promise<{
  success: boolean
  error?: string
  phrases: TestimonialPhrase[]
}> {
  try {
    const { data: phrases, error } = await supabase
      .from('testimonial_phrases')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching testimonial phrases:', error)
      return {
        success: false,
        error: 'Failed to fetch testimonial phrases',
        phrases: [],
      }
    }

    return {
      success: true,
      phrases: phrases || [],
    }
  } catch (error) {
    console.error('Error fetching testimonial phrases:', error)
    return {
      success: false,
      error: 'An error occurred',
      phrases: [],
    }
  }
}

export async function getTestimonials(): Promise<{
  success: boolean
  error?: string
  testimonials: Testimonial[]
}> {
  try {
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching testimonials:', error)
      return {
        success: false,
        error: 'Failed to fetch testimonials',
        testimonials: [],
      }
    }

    return {
      success: true,
      testimonials: testimonials || [],
    }
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return {
      success: false,
      error: 'An error occurred',
      testimonials: [],
    }
  }
}

export async function createTestimonialPhrase(formData: {
  quote: string
  emphasis: boolean
  order_index: number
}): Promise<{
  success: boolean
  error?: string
  phrase?: TestimonialPhrase
}> {
  try {
    const session = await getAdminSession()
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    if (!supabaseAdmin) {
      return {
        success: false,
        error: 'Service role client not configured',
      }
    }

    const validatedData = testimonialPhraseSchema.parse(formData)

    const { data: phrase, error } = await supabaseAdmin
      .from('testimonial_phrases')
      .insert({
        quote: validatedData.quote,
        emphasis: validatedData.emphasis,
        order_index: validatedData.order_index,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error || !phrase) {
      console.error('Error creating testimonial phrase:', error)
      return {
        success: false,
        error: 'Failed to create testimonial phrase',
      }
    }

    return {
      success: true,
      phrase,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    console.error('Error creating testimonial phrase:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function updateTestimonialPhrase(formData: {
  id: string
  quote: string
  emphasis: boolean
  order_index: number
}): Promise<{
  success: boolean
  error?: string
  phrase?: TestimonialPhrase
}> {
  try {
    const session = await getAdminSession()
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    if (!supabaseAdmin) {
      return {
        success: false,
        error: 'Service role client not configured',
      }
    }

    const validatedData = testimonialPhraseUpdateSchema.parse(formData)

    const { data: phrase, error } = await supabaseAdmin
      .from('testimonial_phrases')
      .update({
        quote: validatedData.quote,
        emphasis: validatedData.emphasis,
        order_index: validatedData.order_index,
        updated_at: new Date().toISOString(),
      })
      .eq('id', validatedData.id)
      .select()
      .single()

    if (error || !phrase) {
      console.error('Error updating testimonial phrase:', error)
      return {
        success: false,
        error: 'Failed to update testimonial phrase',
      }
    }

    return {
      success: true,
      phrase,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    console.error('Error updating testimonial phrase:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function deleteTestimonialPhrase(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const session = await getAdminSession()
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    if (!supabaseAdmin) {
      return {
        success: false,
        error: 'Service role client not configured',
      }
    }

    const { error } = await supabaseAdmin
      .from('testimonial_phrases')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting testimonial phrase:', error)
      return {
        success: false,
        error: 'Failed to delete testimonial phrase',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting testimonial phrase:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function reorderTestimonialPhrases(phraseIds: string[]): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const session = await getAdminSession()
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    if (!supabaseAdmin) {
      return {
        success: false,
        error: 'Service role client not configured',
      }
    }

    const updatePromises = phraseIds.map((id, index) =>
      supabaseAdmin!
        .from('testimonial_phrases')
        .update({ order_index: index, updated_at: new Date().toISOString() })
        .eq('id', id)
    )

    const results = await Promise.allSettled(updatePromises)

    const failedUpdates = results.filter(result => result.status === 'rejected')
    if (failedUpdates.length > 0) {
      console.error('Error reordering testimonial phrases: Some updates failed')
      return {
        success: false,
        error: 'Failed to reorder testimonial phrases',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error reordering testimonial phrases:', error)
    return {
      success: false,
      error: 'Failed to reorder testimonial phrases',
    }
  }
}

export async function createTestimonial(formData: {
  quote: string
  author: string
  role: string
  order_index: number
}): Promise<{
  success: boolean
  error?: string
  testimonial?: Testimonial
}> {
  try {
    const session = await getAdminSession()
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    if (!supabaseAdmin) {
      return {
        success: false,
        error: 'Service role client not configured',
      }
    }

    const validatedData = testimonialSchema.parse(formData)

    const { data: testimonial, error } = await supabaseAdmin
      .from('testimonials')
      .insert({
        quote: validatedData.quote,
        author: validatedData.author,
        role: validatedData.role,
        order_index: validatedData.order_index,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error || !testimonial) {
      console.error('Error creating testimonial:', error)
      return {
        success: false,
        error: 'Failed to create testimonial',
      }
    }

    return {
      success: true,
      testimonial,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    console.error('Error creating testimonial:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function updateTestimonial(formData: {
  id: string
  quote: string
  author: string
  role: string
  order_index: number
}): Promise<{
  success: boolean
  error?: string
  testimonial?: Testimonial
}> {
  try {
    const session = await getAdminSession()
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    if (!supabaseAdmin) {
      return {
        success: false,
        error: 'Service role client not configured',
      }
    }

    const validatedData = testimonialUpdateSchema.parse(formData)

    const { data: testimonial, error } = await supabaseAdmin
      .from('testimonials')
      .update({
        quote: validatedData.quote,
        author: validatedData.author,
        role: validatedData.role,
        order_index: validatedData.order_index,
        updated_at: new Date().toISOString(),
      })
      .eq('id', validatedData.id)
      .select()
      .single()

    if (error || !testimonial) {
      console.error('Error updating testimonial:', error)
      return {
        success: false,
        error: 'Failed to update testimonial',
      }
    }

    return {
      success: true,
      testimonial,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    console.error('Error updating testimonial:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function deleteTestimonial(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const session = await getAdminSession()
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    if (!supabaseAdmin) {
      return {
        success: false,
        error: 'Service role client not configured',
      }
    }

    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting testimonial:', error)
      return {
        success: false,
        error: 'Failed to delete testimonial',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function reorderTestimonials(testimonialIds: string[]): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const session = await getAdminSession()
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    if (!supabaseAdmin) {
      return {
        success: false,
        error: 'Service role client not configured',
      }
    }

    const updatePromises = testimonialIds.map((id, index) =>
      supabaseAdmin!
        .from('testimonials')
        .update({ order_index: index, updated_at: new Date().toISOString() })
        .eq('id', id)
    )

    const results = await Promise.allSettled(updatePromises)

    const failedUpdates = results.filter(result => result.status === 'rejected')
    if (failedUpdates.length > 0) {
      console.error('Error reordering testimonials: Some updates failed')
      return {
        success: false,
        error: 'Failed to reorder testimonials',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error reordering testimonials:', error)
    return {
      success: false,
      error: 'Failed to reorder testimonials',
    }
  }
}
