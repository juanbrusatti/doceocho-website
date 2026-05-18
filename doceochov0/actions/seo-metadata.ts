'use server'

import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/actions/admin-auth'
import type { SEOMetadata } from '@/types/seo-metadata'
import { STORAGE_BUCKET } from '@/constants/storage'

const seoMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  og_title: z.string().min(1, 'OG title is required'),
  og_description: z.string().min(1, 'OG description is required'),
  og_image: z.string().min(1, 'OG image is required'),
  favicon: z.string().min(1, 'Favicon is required'),
})

const imageFileSchema = z
  .object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
  })
  .refine((file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/x-icon', 'image/vnd.microsoft.icon']
    return validTypes.includes(file.type)
  }, 'Invalid file type. Only JPG, PNG, WEBP, GIF, and ICO are allowed')
  .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')

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
  ogImageFile?: File
  faviconFile?: File
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

    let ogImagePath = formData.og_image
    let faviconPath = formData.favicon
    const uploadedFiles: string[] = []

    // Upload OG image if provided
    if (formData.ogImageFile) {
      const file = formData.ogImageFile

      // Validate file on server side
      try {
        imageFileSchema.parse(file)
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            success: false,
            error: error.errors[0].message,
          }
        }
        return {
          success: false,
          error: 'Invalid OG image file',
        }
      }

      // Delete old OG image if it exists
      if (ogImagePath) {
        try {
          const oldFileName = ogImagePath.split('/').pop()
          if (oldFileName) {
            const { error: deleteError } = await supabaseAdmin.storage
              .from(STORAGE_BUCKET)
              .remove([oldFileName])
            if (deleteError) {
              console.error('Error deleting old OG image:', deleteError)
            }
          }
        } catch (error) {
          console.error('Error deleting old OG image:', error)
        }
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      uploadedFiles.push(fileName)

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        console.error('Error uploading OG image:', uploadError)
        return {
          success: false,
          error: uploadError.message,
        }
      }

      const { data: urlData } = supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName)

      ogImagePath = urlData.publicUrl
    }

    // Upload favicon if provided
    if (formData.faviconFile) {
      const file = formData.faviconFile

      // Validate file on server side
      try {
        imageFileSchema.parse(file)
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            success: false,
            error: error.errors[0].message,
          }
        }
        return {
          success: false,
          error: 'Invalid favicon file',
        }
      }

      // Delete old favicon if it exists
      if (faviconPath) {
        try {
          const oldFileName = faviconPath.split('/').pop()
          if (oldFileName) {
            const { error: deleteError } = await supabaseAdmin.storage
              .from(STORAGE_BUCKET)
              .remove([oldFileName])
            if (deleteError) {
              console.error('Error deleting old favicon:', deleteError)
            }
          }
        } catch (error) {
          console.error('Error deleting old favicon:', error)
        }
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      uploadedFiles.push(fileName)

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        console.error('Error uploading favicon:', uploadError)
        return {
          success: false,
          error: uploadError.message,
        }
      }

      const { data: urlData } = supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName)

      faviconPath = urlData.publicUrl
    }

    const validatedData = seoMetadataSchema.parse({
      title: formData.title,
      description: formData.description,
      og_title: formData.og_title,
      og_description: formData.og_description,
      og_image: ogImagePath,
      favicon: faviconPath,
    })

    // First, get the existing metadata ID
    const { data: existingMetadata } = await supabaseAdmin
      .from('seo_metadata')
      .select('id')
      .single()

    if (!existingMetadata) {
      // Rollback: delete uploaded files
      if (uploadedFiles.length > 0) {
        try {
          const { error: deleteError } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .remove(uploadedFiles)
          if (deleteError) {
            console.error('Error during rollback cleanup:', deleteError)
          }
        } catch (error) {
          console.error('Error during rollback cleanup:', error)
        }
      }
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
      // Rollback: delete uploaded files
      if (uploadedFiles.length > 0) {
        try {
          const { error: deleteError } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .remove(uploadedFiles)
          if (deleteError) {
            console.error('Error during rollback cleanup:', deleteError)
          }
        } catch (error) {
          console.error('Error during rollback cleanup:', error)
        }
      }
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
