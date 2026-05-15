'use server'

import { z } from 'zod'
import { supabase, supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/actions/admin-auth'
import type { SiteConfig } from '@/types/site-config'

const siteConfigSchema = z.object({
  whatsapp_number: z.string().min(1, 'WhatsApp number is required'),
  email: z.string().email('Invalid email address'),
  instagram_url: z.string().url('Invalid Instagram URL'),
  studio_name: z.string().min(1, 'Studio name is required'),
  footer_tagline: z.string().min(1, 'Footer tagline is required'),
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
})

export async function getSiteConfig(): Promise<{
  success: boolean
  error?: string
  config?: SiteConfig
}> {
  try {
    const { data: config, error } = await supabase
      .from('site_config')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching site config:', error)
      return {
        success: false,
        error: 'Failed to fetch site config',
      }
    }

    return {
      success: true,
      config,
    }
  } catch (error) {
    console.error('Error fetching site config:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function updateSiteConfig(formData: {
  whatsapp_number: string
  email: string
  instagram_url: string
  studio_name: string
  footer_tagline: string
  specialties: string[]
}): Promise<{
  success: boolean
  error?: string
  config?: SiteConfig
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

    const validatedData = siteConfigSchema.parse(formData)

    // First, get the existing config ID
    const { data: existingConfig } = await supabaseAdmin
      .from('site_config')
      .select('id')
      .single()

    if (!existingConfig) {
      return {
        success: false,
        error: 'No site config found',
      }
    }

    const { data: config, error } = await supabaseAdmin
      .from('site_config')
      .update({
        whatsapp_number: validatedData.whatsapp_number,
        email: validatedData.email,
        instagram_url: validatedData.instagram_url,
        studio_name: validatedData.studio_name,
        footer_tagline: validatedData.footer_tagline,
        specialties: validatedData.specialties,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingConfig.id)
      .select()
      .single()

    if (error || !config) {
      console.error('Error updating site config:', error)
      return {
        success: false,
        error: 'Failed to update site config',
      }
    }

    return {
      success: true,
      config,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    console.error('Error updating site config:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}
