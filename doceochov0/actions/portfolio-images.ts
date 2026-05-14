'use server'

import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/actions/admin-auth'
import type { PortfolioProjectWithImages } from '@/types/portfolio'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const imageFileSchema = z.custom<File>((file) => {
  if (!file) {
    return false
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return false
  }

  if (file.size > MAX_FILE_SIZE) {
    return false
  }

  return true
}, 'Invalid file: must be an image (JPEG, PNG, WebP, GIF) under 10MB')

const portfolioProjectSchema = z.object({
  title: z.string().nullable().optional(),
  category: z.enum(['Residencial', 'Comercial', 'Mobiliario']),
  imageFiles: z.array(imageFileSchema).min(1, 'At least one image is required'),
})

const portfolioProjectUpdateSchema = z.object({
  title: z.string().nullable().optional(),
  category: z.enum(['Residencial', 'Comercial', 'Mobiliario']),
})

export async function getPortfolioProjects() {
  try {
    const { data: projects, error: projectsError } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (projectsError) {
      console.error('Error fetching portfolio projects:', projectsError)
      return {
        success: false,
        error: 'Failed to fetch portfolio projects',
        projects: [],
      }
    }

    // Get images for each project
    const projectsWithImages: PortfolioProjectWithImages[] = []
    for (const project of projects || []) {
      const { data: images, error: imagesError } = await supabase
        .from('portfolio_project_images')
        .select('*')
        .eq('project_id', project.id)
        .order('order_index', { ascending: true })

      if (!imagesError) {
        projectsWithImages.push({
          ...project,
          images: images || [],
        })
      }
    }

    return {
      success: true,
      projects: projectsWithImages,
    }
  } catch (error) {
    console.error('Portfolio projects fetch error:', error)
    return {
      success: false,
      error: 'An error occurred',
      projects: [],
    }
  }
}

export async function getPortfolioProject(id: string) {
  try {
    const { data: project, error: projectError } = await supabase
      .from('portfolio_projects')
      .select('*')
      .eq('id', id)
      .single()

    if (projectError || !project) {
      console.error('Error fetching portfolio project:', projectError)
      return {
        success: false,
        error: 'Failed to fetch portfolio project',
        project: null,
      }
    }

    const { data: images, error: imagesError } = await supabase
      .from('portfolio_project_images')
      .select('*')
      .eq('project_id', project.id)
      .order('order_index', { ascending: true })

    if (imagesError) {
      console.error('Error fetching project images:', imagesError)
      return {
        success: false,
        error: 'Failed to fetch project images',
        project: null,
      }
    }

    return {
      success: true,
      project: {
        ...project,
        images: images || [],
      },
    }
  } catch (error) {
    console.error('Portfolio project fetch error:', error)
    return {
      success: false,
      error: 'An error occurred',
      project: null,
    }
  }
}

export async function createPortfolioProject(formData: {
  title: string | null
  category: 'Residencial' | 'Comercial' | 'Mobiliario'
  imageFiles: File[]
}) {
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

    if (!formData.imageFiles || formData.imageFiles.length === 0) {
      return {
        success: false,
        error: 'At least one image is required',
      }
    }

    const validatedData = portfolioProjectSchema.parse(formData)
    
    // Validate all files
    for (const file of formData.imageFiles) {
      imageFileSchema.parse(file)
    }

    // Create project
    const { data: project, error: insertError } = await supabaseAdmin
      .from('portfolio_projects')
      .insert({
        title: validatedData.title || null,
        category: validatedData.category,
      })
      .select()
      .single()

    if (insertError || !project) {
      console.error('Error creating portfolio project:', insertError)
      return {
        success: false,
        error: 'Failed to create portfolio project',
      }
    }

    // Upload all images and track paths for cleanup
    const uploadedFilePaths: string[] = []
    const uploadPromises = formData.imageFiles.map(async (file, index) => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { data: uploadData, error: uploadError } = await supabaseAdmin!.storage
        .from('portfolio-images')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Failed to upload image ${index + 1}`)
      }

      // Track uploaded file path for cleanup
      uploadedFilePaths.push(filePath)

      const { data: urlData } = supabaseAdmin!.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      // Insert image record
      const { error: imageInsertError } = await supabaseAdmin!
        .from('portfolio_project_images')
        .insert({
          project_id: project.id,
          image_path: urlData.publicUrl,
          order_index: index,
        })

      if (imageInsertError) {
        throw new Error(`Failed to save image record ${index + 1}`)
      }

      return urlData.publicUrl
    })

    try {
      await Promise.all(uploadPromises)
    } catch (error) {
      console.error('Error uploading images:', error)
      
      // Clean up uploaded files from storage
      for (const filePath of uploadedFilePaths) {
        try {
          await supabaseAdmin!.storage
            .from('portfolio-images')
            .remove([filePath])
        } catch (cleanupError) {
          console.error('Error cleaning up uploaded file:', filePath, cleanupError)
        }
      }
      
      // Delete project
      await supabaseAdmin!.from('portfolio_projects').delete().eq('id', project.id)
      
      return {
        success: false,
        error: 'Failed to upload images',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fileError = error.errors.find((e) => e.path.includes('imageFiles'))
      if (fileError) {
        return {
          success: false,
          error: fileError.message,
        }
      }
      return {
        success: false,
        error: 'Validation error',
      }
    }
    console.error('Portfolio project creation error:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function updatePortfolioProject(
  id: string,
  formData: {
    title: string | null
    category: 'Residencial' | 'Comercial' | 'Mobiliario'
  }
) {
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

    const validatedData = portfolioProjectUpdateSchema.parse(formData)

    const { error } = await supabaseAdmin
      .from('portfolio_projects')
      .update({
        title: validatedData.title || null,
        category: validatedData.category,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating portfolio project:', error)
      return {
        success: false,
        error: 'Failed to update portfolio project',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error',
      }
    }
    console.error('Portfolio project update error:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function addProjectImages(
  projectId: string,
  imageFiles: File[]
) {
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

    if (!imageFiles || imageFiles.length === 0) {
      return {
        success: false,
        error: 'At least one image is required',
      }
    }

    // Validate all files
    for (const file of imageFiles) {
      imageFileSchema.parse(file)
    }

    // Get current max order index
    const { data: currentImages } = await supabaseAdmin
      .from('portfolio_project_images')
      .select('order_index')
      .eq('project_id', projectId)
      .order('order_index', { ascending: false })
      .limit(1)

    const startIndex = currentImages && currentImages.length > 0 ? currentImages[0].order_index + 1 : 0

    // Upload all images and track paths for cleanup
    const uploadedFilePaths: string[] = []
    const uploadPromises = imageFiles.map(async (file, index) => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { data: uploadData, error: uploadError } = await supabaseAdmin!.storage
        .from('portfolio-images')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Failed to upload image ${index + 1}`)
      }

      // Track uploaded file path for cleanup
      uploadedFilePaths.push(filePath)

      const { data: urlData } = supabaseAdmin!.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      // Insert image record
      const { error: imageInsertError } = await supabaseAdmin!
        .from('portfolio_project_images')
        .insert({
          project_id: projectId,
          image_path: urlData.publicUrl,
          order_index: startIndex + index,
        })

      if (imageInsertError) {
        throw new Error(`Failed to save image record ${index + 1}`)
      }

      return urlData.publicUrl
    })

    try {
      await Promise.all(uploadPromises)
    } catch (error) {
      console.error('Error uploading images:', error)
      
      // Clean up uploaded files from storage
      for (const filePath of uploadedFilePaths) {
        try {
          await supabaseAdmin!.storage
            .from('portfolio-images')
            .remove([filePath])
        } catch (cleanupError) {
          console.error('Error cleaning up uploaded file:', filePath, cleanupError)
        }
      }
      
      return {
        success: false,
        error: 'Failed to upload images',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fileError = error.errors.find((e) => e.path.includes('imageFiles'))
      if (fileError) {
        return {
          success: false,
          error: fileError.message,
        }
      }
      return {
        success: false,
        error: 'Validation error',
      }
    }
    console.error('Project images addition error:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function deleteProjectImage(imageId: string) {
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

    // Get project image to delete file
    const { data: image, error: fetchError } = await supabaseAdmin
      .from('portfolio_project_images')
      .select('image_path')
      .eq('id', imageId)
      .single()

    if (fetchError || !image) {
      return {
        success: false,
        error: 'Project image not found',
      }
    }

    // Delete project image
    const { error: deleteError } = await supabaseAdmin
      .from('portfolio_project_images')
      .delete()
      .eq('id', imageId)

    if (deleteError) {
      console.error('Error deleting project image:', deleteError)
      return {
        success: false,
        error: 'Failed to delete project image',
      }
    }

    // Delete image file
    const filePath = image.image_path.split('/').pop()
    if (filePath) {
      await supabaseAdmin.storage.from('portfolio-images').remove([filePath])
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Project image deletion error:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function deletePortfolioProject(id: string) {
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

    // Get all project images to delete files
    const { data: images, error: fetchError } = await supabaseAdmin
      .from('portfolio_project_images')
      .select('image_path')
      .eq('project_id', id)

    if (fetchError) {
      console.error('Error fetching project images:', fetchError)
      return {
        success: false,
        error: 'Failed to fetch project images',
      }
    }

    // Delete project (cascade will delete images from portfolio_project_images table)
    const { error: deleteError } = await supabaseAdmin
      .from('portfolio_projects')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting portfolio project:', deleteError)
      return {
        success: false,
        error: 'Failed to delete portfolio project',
      }
    }

    // Delete all image files
    if (images) {
      const filePaths = images.map((img) => img.image_path.split('/').pop()).filter(Boolean) as string[]
      if (filePaths.length > 0) {
        await supabaseAdmin.storage.from('portfolio-images').remove(filePaths)
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Portfolio project deletion error:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}
