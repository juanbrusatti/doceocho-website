'use server'

import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/actions/admin-auth'
import type { AboutContent } from '@/types/about-content'
import { STORAGE_BUCKET } from '@/constants/storage'

const statSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
})

const aboutContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  quote: z.string().min(1, 'Quote is required'),
  stats: z.array(statSchema).min(1, 'At least one stat is required'),
  image_path: z.string().min(1, 'Image path is required'),
})

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    return validTypes.includes(file.type)
  }, 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed')
  .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')

export async function getAboutContent(): Promise<{
  success: boolean
  error?: string
  content?: AboutContent
}> {
  try {
    const { data: content, error } = await supabase
      .from('about_content')
      .select('*')
      .single()

    if (error || !content) {
      console.error('Error fetching About content:', error)
      return {
        success: false,
        error: 'Failed to fetch About content',
      }
    }

    return {
      success: true,
      content,
    }
  } catch (error) {
    console.error('Error fetching About content:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function updateAboutContent(formData: {
  title: string
  description: string
  quote: string
  stats: { value: string; label: string }[]
  image_path: string
  imageFile?: File
}): Promise<{
  success: boolean
  error?: string
  content?: AboutContent
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

    let imagePath = formData.image_path
    const uploadedFiles: string[] = []

    // Upload new image if provided
    if (formData.imageFile) {
      const file = formData.imageFile

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
          error: 'Invalid file',
        }
      }

      // Delete old image if it exists
      if (imagePath) {
        try {
          const oldFileName = imagePath.split('/').pop()
          if (oldFileName) {
            const { error: deleteError } = await supabaseAdmin.storage
              .from(STORAGE_BUCKET)
              .remove([oldFileName])
            if (deleteError) {
              console.error('Error deleting old image:', deleteError)
            }
          }
        } catch (error) {
          console.error('Error deleting old image:', error)
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
        console.error('Error uploading image:', uploadError)
        return {
          success: false,
          error: uploadError.message,
        }
      }

      const { data: urlData } = supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName)

      imagePath = urlData.publicUrl
    }

    const validatedData = aboutContentSchema.parse({
      title: formData.title,
      description: formData.description,
      quote: formData.quote,
      stats: formData.stats,
      image_path: imagePath,
    })

    // First, get the existing content ID
    const { data: existingContent } = await supabaseAdmin
      .from('about_content')
      .select('id')
      .single()

    if (!existingContent) {
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
        error: 'No about content found',
      }
    }

    const { data: content, error } = await supabaseAdmin
      .from('about_content')
      .update({
        title: validatedData.title,
        description: validatedData.description,
        quote: validatedData.quote,
        stats: validatedData.stats,
        image_path: validatedData.image_path,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingContent.id)
      .select()
      .single()

    if (error || !content) {
      console.error('Error updating about content:', error)
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
        error: 'Failed to update about content',
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
    console.error('Error updating about content:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}
