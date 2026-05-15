'use server'

import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/actions/admin-auth'
import type { SEOMetadata } from '@/types/seo-metadata'

const seoMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  og_title: z.string().min(1, 'OG title is required'),
  og_description: z.string().min(1, 'OG description is required'),
  og_image: z.string().min(1, 'OG image is required'),
  favicon: z.string().min(1, 'Favicon is required'),
})

export async function getSEOMetadata(): Promise<{
  success: boolean
  error?: string
  metadata?: SEOMetadata
}> {
  try {
    const { data: metadata, error } = await supabase
      .from('seo_metadata')
      .select('*')
      .single()

    if (error || !metadata) {
      console.error('Error fetching SEO metadata:', error)
      return {
        success: false,
        error: 'Failed to fetch SEO metadata',
      }
    }

    return {
      success: true,
      metadata,
    }
  } catch (error) {
    console.error('Error fetching SEO metadata:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function updateSEOMetadata(formData: {
  title: string
  description: string
  og_title: string
  og_description: string
  og_image: string
  favicon: string
}): Promise<{
  success: boolean
  error?: string
  metadata?: SEOMetadata
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

    const validatedData = seoMetadataSchema.parse(formData)

    // First, get the existing metadata ID
    const { data: existingMetadata } = await supabaseAdmin
      .from('seo_metadata')
      .select('id')
      .single()

    if (!existingMetadata) {
      return {
        success: false,
        error: 'No SEO metadata found',
      }
    }

    const { data: metadata, error } = await supabaseAdmin
      .from('seo_metadata')
      .update({
        title: validatedData.title,
        description: validatedData.description,
        og_title: validatedData.og_title,
        og_description: validatedData.og_description,
        og_image: validatedData.og_image,
        favicon: validatedData.favicon,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingMetadata.id)
      .select()
      .single()

    if (error || !metadata) {
      console.error('Error updating SEO metadata:', error)
      return {
        success: false,
        error: 'Failed to update SEO metadata',
      }
    }

    return {
      success: true,
      metadata,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    console.error('Error updating SEO metadata:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}
