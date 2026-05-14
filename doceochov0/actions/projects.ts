'use server'

import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/actions/admin-auth'

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['Residencial', 'Comercial', 'Mobiliario']),
  description: z.string().min(1, 'Description is required'),
  year: z.string().min(1, 'Year is required'),
  size: z.enum(['large', 'small']),
})

export async function getProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return {
        success: false,
        error: 'Failed to fetch projects',
        projects: [],
      }
    }

    return {
      success: true,
      projects: data || [],
    }
  } catch (error) {
    console.error('Projects fetch error:', error)
    return {
      success: false,
      error: 'An error occurred',
      projects: [],
    }
  }
}

export async function getProject(id: string) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return {
        success: false,
        error: 'Failed to fetch project',
        project: null,
      }
    }

    return {
      success: true,
      project: data,
    }
  } catch (error) {
    console.error('Project fetch error:', error)
    return {
      success: false,
      error: 'An error occurred',
      project: null,
    }
  }
}

export async function createProject(formData: {
  title: string
  category: 'Residencial' | 'Comercial' | 'Mobiliario'
  description: string
  imageFile: File
  year: string
  size: 'large' | 'small'
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

    const validatedData = projectSchema.parse(formData)

    // Upload image
    const fileExt = formData.imageFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}`

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('project-images')
      .upload(filePath, formData.imageFile)

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      return {
        success: false,
        error: 'Failed to upload image',
      }
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('project-images')
      .getPublicUrl(filePath)

    // Insert project
    const { error: insertError } = await supabaseAdmin
      .from('projects')
      .insert({
        title: validatedData.title,
        category: validatedData.category,
        description: validatedData.description,
        image_path: urlData.publicUrl,
        year: validatedData.year,
        size: validatedData.size,
      })

    if (insertError) {
      console.error('Error creating project:', insertError)
      // Delete uploaded image if project creation fails
      await supabaseAdmin.storage.from('project-images').remove([filePath])
      return {
        success: false,
        error: 'Failed to create project',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Project creation error:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function updateProject(
  id: string,
  formData: {
    title: string
    category: 'Residencial' | 'Comercial' | 'Mobiliario'
    description: string
    year: string
    size: 'large' | 'small'
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

    const validatedData = projectSchema.parse(formData)

    const { error } = await supabaseAdmin
      .from('projects')
      .update({
        title: validatedData.title,
        category: validatedData.category,
        description: validatedData.description,
        year: validatedData.year,
        size: validatedData.size,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating project:', error)
      return {
        success: false,
        error: 'Failed to update project',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Project update error:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function updateProjectImage(
  id: string,
  imageFile: File
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

    // Get current project
    const { data: currentProject, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('image_path')
      .eq('id', id)
      .single()

    if (fetchError || !currentProject) {
      return {
        success: false,
        error: 'Project not found',
      }
    }

    // Upload new image
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}`

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('project-images')
      .upload(filePath, imageFile)

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      return {
        success: false,
        error: 'Failed to upload image',
      }
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('project-images')
      .getPublicUrl(filePath)

    // Update project with new image
    const { error: updateError } = await supabaseAdmin
      .from('projects')
      .update({
        image_path: urlData.publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error updating project:', updateError)
      // Delete new image if update fails
      await supabaseAdmin.storage.from('project-images').remove([filePath])
      return {
        success: false,
        error: 'Failed to update project',
      }
    }

    // Delete old image
    const oldFilePath = currentProject.image_path.split('/').pop()
    if (oldFilePath) {
      await supabaseAdmin.storage.from('project-images').remove([oldFilePath])
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Project image update error:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function deleteProject(id: string) {
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

    // Get project to delete image
    const { data: project, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('image_path')
      .eq('id', id)
      .single()

    if (fetchError || !project) {
      return {
        success: false,
        error: 'Project not found',
      }
    }

    // Delete project
    const { error: deleteError } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting project:', deleteError)
      return {
        success: false,
        error: 'Failed to delete project',
      }
    }

    // Delete image
    const filePath = project.image_path.split('/').pop()
    if (filePath) {
      await supabaseAdmin.storage.from('project-images').remove([filePath])
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Project deletion error:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}
