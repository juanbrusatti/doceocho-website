import { supabase, supabaseAdmin } from '@/lib/supabase/client'

export async function uploadImage(
  file: File,
  folder: string = 'general'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Use service role client if available, otherwise fall back to regular client
    const client = supabaseAdmin || supabase

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image',
      }
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must be less than 10MB',
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload to Supabase Storage (using portfolio-images bucket like portfolio does)
    const { data: uploadData, error: uploadError } = await client.storage
      .from('portfolio-images')
      .upload(filePath, file, {
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

    // Get public URL
    const { data: publicUrlData } = client.storage
      .from('portfolio-images')
      .getPublicUrl(filePath)

    return {
      success: true,
      url: publicUrlData.publicUrl,
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return {
      success: false,
      error: 'An error occurred while uploading the image',
    }
  }
}

export async function deleteImage(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    const client = supabaseAdmin || supabase

    // Extract file path from URL
    const urlParts = url.split('/portfolio-images/')
    if (urlParts.length < 2) {
      return {
        success: false,
        error: 'Invalid image URL',
      }
    }

    const filePath = urlParts[1]

    const { error } = await client.storage
      .from('portfolio-images')
      .remove([filePath])

    if (error) {
      console.error('Error deleting image:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    return {
      success: false,
      error: 'An error occurred while deleting the image',
    }
  }
}
