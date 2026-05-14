'use server'

import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/actions/admin-auth'
import type { ProcessStep } from '@/types/process'

const processStepSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  order_index: z.number().int().min(0),
})

const processStepUpdateSchema = z.object({
  id: z.string().uuid('Invalid ID'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  order_index: z.number().int().min(0),
})

export async function getProcessSteps() {
  try {
    const { data: steps, error } = await supabase
      .from('process_steps')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching process steps:', error)
      return {
        success: false,
        error: 'Failed to fetch process steps',
        steps: [],
      }
    }

    return {
      success: true,
      steps: steps || [],
    }
  } catch (error) {
    console.error('Error fetching process steps:', error)
    return {
      success: false,
      error: 'An error occurred',
      steps: [],
    }
  }
}

export async function createProcessStep(formData: {
  title: string
  description: string
  order_index: number
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

    const validatedData = processStepSchema.parse(formData)

    const { data: step, error } = await supabaseAdmin
      .from('process_steps')
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        order_index: validatedData.order_index,
      })
      .select()
      .single()

    if (error || !step) {
      console.error('Error creating process step:', error)
      return {
        success: false,
        error: 'Failed to create process step',
      }
    }

    return {
      success: true,
      step,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    console.error('Error creating process step:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function updateProcessStep(formData: {
  id: string
  title: string
  description: string
  order_index: number
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

    const validatedData = processStepUpdateSchema.parse(formData)

    const { data: step, error } = await supabaseAdmin
      .from('process_steps')
      .update({
        title: validatedData.title,
        description: validatedData.description,
        order_index: validatedData.order_index,
        updated_at: new Date().toISOString(),
      })
      .eq('id', validatedData.id)
      .select()
      .single()

    if (error || !step) {
      console.error('Error updating process step:', error)
      return {
        success: false,
        error: 'Failed to update process step',
      }
    }

    return {
      success: true,
      step,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    console.error('Error updating process step:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function deleteProcessStep(id: string) {
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
      .from('process_steps')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting process step:', error)
      return {
        success: false,
        error: 'Failed to delete process step',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting process step:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function reorderProcessSteps(stepIds: string[]) {
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

    const updatePromises = stepIds.map((id, index) =>
      supabaseAdmin!
        .from('process_steps')
        .update({ order_index: index, updated_at: new Date().toISOString() })
        .eq('id', id)
    )

    await Promise.all(updatePromises)

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error reordering process steps:', error)
    return {
      success: false,
      error: 'Failed to reorder process steps',
    }
  }
}
