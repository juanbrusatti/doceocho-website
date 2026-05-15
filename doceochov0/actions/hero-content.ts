'use server'

import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/actions/admin-auth'
import type { HeroContent } from '@/types/hero-content'

const heroContentSchema = z.object({
  headline: z.string().min(1, 'Headline is required'),
  headline_secondary: z.string().min(1, 'Headline secondary is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  cta_text: z.string().min(1, 'CTA text is required'),
  cta_secondary_text: z.string().min(1, 'CTA secondary text is required'),
  image_path: z.string().min(1, 'Image path is required'),
})

export async function getHeroContent(): Promise<{
  success: boolean
  error?: string
  content?: HeroContent
}> {
  try {
    const { data: content, error } = await supabase
      .from('hero_content')
      .select('*')
      .single()

    if (error || !content) {
      console.error('Error fetching hero content:', error)
      return {
        success: false,
        error: 'Failed to fetch hero content',
      }
    }

    return {
      success: true,
      content,
    }
  } catch (error) {
    console.error('Error fetching hero content:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function updateHeroContent(formData: {
  headline: string
  headline_secondary: string
  subtitle: string
  cta_text: string
  cta_secondary_text: string
  image_path: string
}): Promise<{
  success: boolean
  error?: string
  content?: HeroContent
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

    const validatedData = heroContentSchema.parse(formData)

    // First, get the existing content ID
    const { data: existingContent } = await supabaseAdmin
      .from('hero_content')
      .select('id')
      .single()

    if (!existingContent) {
      return {
        success: false,
        error: 'No hero content found',
      }
    }

    const { data: content, error } = await supabaseAdmin
      .from('hero_content')
      .update({
        headline: validatedData.headline,
        headline_secondary: validatedData.headline_secondary,
        subtitle: validatedData.subtitle,
        cta_text: validatedData.cta_text,
        cta_secondary_text: validatedData.cta_secondary_text,
        image_path: validatedData.image_path,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingContent.id)
      .select()
      .single()

    if (error || !content) {
      console.error('Error updating hero content:', error)
      return {
        success: false,
        error: 'Failed to update hero content',
      }
    }

    return {
      success: true,
      content,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    console.error('Error updating hero content:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}
