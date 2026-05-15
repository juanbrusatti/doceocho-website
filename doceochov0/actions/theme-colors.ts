'use server'

import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/actions/admin-auth'
import type { ThemeColors, ThemeColorsFormData } from '@/types/theme-colors'

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/

const themeColorsSchema = z.object({
  gold: z.string().regex(hexColorRegex, 'Invalid hex color format for gold'),
  cream: z.string().regex(hexColorRegex, 'Invalid hex color format for cream'),
  petroleum_dark: z.string().regex(hexColorRegex, 'Invalid hex color format for petroleum dark'),
  petroleum_light: z.string().regex(hexColorRegex, 'Invalid hex color format for petroleum light'),
})

export async function getThemeColors(): Promise<{
  success: boolean
  error?: string
  colors: ThemeColors | null
}> {
  try {
    if (!supabaseAdmin) {
      return {
        success: false,
        error: 'Service role client not configured',
        colors: null,
      }
    }

    const { data: colors, error } = await supabaseAdmin
      .from('theme_colors')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching theme colors:', error)
      return {
        success: false,
        error: 'Failed to fetch theme colors',
        colors: null,
      }
    }

    return {
      success: true,
      colors,
    }
  } catch (error) {
    console.error('Theme colors fetch error:', error)
    return {
      success: false,
      error: 'An error occurred',
      colors: null,
    }
  }
}

export async function updateThemeColors(
  formData: ThemeColorsFormData
): Promise<{
  success: boolean
  error?: string
  colors?: ThemeColors
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

    const validatedData = themeColorsSchema.parse(formData)

    const { data: existingColors } = await supabaseAdmin
      .from('theme_colors')
      .select('id')
      .single()

    if (!existingColors) {
      return {
        success: false,
        error: 'No theme colors found',
      }
    }

    const { data: colors, error } = await supabaseAdmin
      .from('theme_colors')
      .update({
        gold: validatedData.gold,
        cream: validatedData.cream,
        petroleum_dark: validatedData.petroleum_dark,
        petroleum_light: validatedData.petroleum_light,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingColors.id)
      .select()
      .single()

    if (error || !colors) {
      console.error('Error updating theme colors:', error)
      return {
        success: false,
        error: 'Failed to update theme colors',
      }
    }

    return {
      success: true,
      colors,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    console.error('Theme colors update error:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}
