'use server'

import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/actions/admin-auth'
import type { MaterialsContent, MaterialQuality } from '@/types/materials'

const materialQualitySchema = z.object({
  label: z.string().min(1, 'Label is required'),
  description: z.string().min(1, 'Description is required'),
  order_index: z.number().int().min(0),
})

const materialQualityUpdateSchema = z.object({
  id: z.string().uuid('Invalid ID'),
  label: z.string().min(1, 'Label is required'),
  description: z.string().min(1, 'Description is required'),
  order_index: z.number().int().min(0),
})

const materialsContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  quote: z.string().min(1, 'Quote is required'),
  image_path: z.string().min(1, 'Image path is required'),
})

export async function getMaterialsContent(): Promise<{
  success: boolean
  error?: string
  content?: MaterialsContent
}> {
  try {
    const { data: content, error } = await supabase
      .from('materials_content')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching materials content:', error)
      return {
        success: false,
        error: 'Failed to fetch materials content',
      }
    }

    return {
      success: true,
      content,
    }
  } catch (error) {
    console.error('Error fetching materials content:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function getMaterialQualities(): Promise<{
  success: boolean
  error?: string
  qualities: MaterialQuality[]
}> {
  try {
    const { data: qualities, error } = await supabase
      .from('material_qualities')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching material qualities:', error)
      return {
        success: false,
        error: 'Failed to fetch material qualities',
        qualities: [],
      }
    }

    return {
      success: true,
      qualities: qualities || [],
    }
  } catch (error) {
    console.error('Error fetching material qualities:', error)
    return {
      success: false,
      error: 'An error occurred',
      qualities: [],
    }
  }
}

export async function updateMaterialsContent(formData: {
  title: string
  description: string
  quote: string
  image_path: string
}): Promise<{
  success: boolean
  error?: string
  content?: MaterialsContent
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

    const validatedData = materialsContentSchema.parse(formData)

    // First, get the existing content ID
    const { data: existingContent } = await supabaseAdmin
      .from('materials_content')
      .select('id')
      .single()

    if (!existingContent) {
      return {
        success: false,
        error: 'No materials content found',
      }
    }

    const { data: content, error } = await supabaseAdmin
      .from('materials_content')
      .update({
        title: validatedData.title,
        description: validatedData.description,
        quote: validatedData.quote,
        image_path: validatedData.image_path,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingContent.id)
      .select()
      .single()

    if (error || !content) {
      console.error('Error updating materials content:', error)
      return {
        success: false,
        error: 'Failed to update materials content',
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
    console.error('Error updating materials content:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function createMaterialQuality(formData: {
  label: string
  description: string
  order_index: number
}): Promise<{
  success: boolean
  error?: string
  quality?: MaterialQuality
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

    const validatedData = materialQualitySchema.parse(formData)

    const { data: quality, error } = await supabaseAdmin
      .from('material_qualities')
      .insert({
        label: validatedData.label,
        description: validatedData.description,
        order_index: validatedData.order_index,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error || !quality) {
      console.error('Error creating material quality:', error)
      return {
        success: false,
        error: 'Failed to create material quality',
      }
    }

    return {
      success: true,
      quality,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    console.error('Error creating material quality:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function updateMaterialQuality(formData: {
  id: string
  label: string
  description: string
  order_index: number
}): Promise<{
  success: boolean
  error?: string
  quality?: MaterialQuality
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

    const validatedData = materialQualityUpdateSchema.parse(formData)

    const { data: quality, error } = await supabaseAdmin
      .from('material_qualities')
      .update({
        label: validatedData.label,
        description: validatedData.description,
        order_index: validatedData.order_index,
        updated_at: new Date().toISOString(),
      })
      .eq('id', validatedData.id)
      .select()
      .single()

    if (error || !quality) {
      console.error('Error updating material quality:', error)
      return {
        success: false,
        error: 'Failed to update material quality',
      }
    }

    return {
      success: true,
      quality,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    console.error('Error updating material quality:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function deleteMaterialQuality(id: string): Promise<{
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
      .from('material_qualities')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting material quality:', error)
      return {
        success: false,
        error: 'Failed to delete material quality',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting material quality:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function reorderMaterialQualities(qualityIds: string[]): Promise<{
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

    const updatePromises = qualityIds.map((id, index) =>
      supabaseAdmin!
        .from('material_qualities')
        .update({ order_index: index, updated_at: new Date().toISOString() })
        .eq('id', id)
    )

    const results = await Promise.allSettled(updatePromises)

    const failedUpdates = results.filter(result => result.status === 'rejected')
    if (failedUpdates.length > 0) {
      console.error('Error reordering material qualities: Some updates failed')
      return {
        success: false,
        error: 'Failed to reorder material qualities',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error reordering material qualities:', error)
    return {
      success: false,
      error: 'Failed to reorder material qualities',
    }
  }
}
