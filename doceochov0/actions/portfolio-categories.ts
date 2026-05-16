'use server'

import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/actions/admin-auth'
import type { PortfolioCategory, PortfolioCategoryFormData } from '@/types/portfolio-categories'

const portfolioCategorySchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be less than 100 characters')
    .trim()
    .refine(val => val.length > 0, 'Category name cannot be only whitespace'),
})

export async function getPortfolioCategories() {
  try {
    // Use admin client to bypass RLS
    const client = supabaseAdmin || supabase
    const { data, error } = await client
      .from('portfolio_categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching portfolio categories:', error)
      return {
        success: false,
        error: 'Failed to fetch portfolio categories',
        categories: [],
      }
    }

    return {
      success: true,
      categories: data || [],
    }
  } catch (error) {
    console.error('Portfolio categories fetch error:', error)
    return {
      success: false,
      error: 'An error occurred',
      categories: [],
    }
  }
}

export async function getPortfolioCategory(id: string) {
  try {
    // Use admin client to bypass RLS
    const client = supabaseAdmin || supabase
    const { data, error } = await client
      .from('portfolio_categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Error fetching portfolio category:', error)
      return {
        success: false,
        error: 'Failed to fetch portfolio category',
        category: null,
      }
    }

    return {
      success: true,
      category: data,
    }
  } catch (error) {
    console.error('Portfolio category fetch error:', error)
    return {
      success: false,
      error: 'An error occurred',
      category: null,
    }
  }
}

export async function createPortfolioCategory(formData: PortfolioCategoryFormData) {
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

    const validatedData = portfolioCategorySchema.parse(formData)

    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Validate that slug is not empty
    if (!slug) {
      return {
        success: false,
        error: 'Category name must contain at least one alphanumeric character',
      }
    }

    // Check if category with same name already exists
    const { data: existingCategory } = await supabaseAdmin
      .from('portfolio_categories')
      .select('id')
      .eq('name', validatedData.name)
      .single()

    if (existingCategory) {
      return {
        success: false,
        error: 'Category with this name already exists',
      }
    }

    // Check if slug already exists
    const { data: existingSlug } = await supabaseAdmin
      .from('portfolio_categories')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingSlug) {
      return {
        success: false,
        error: 'Category with similar name already exists',
      }
    }

    const { data, error } = await supabaseAdmin
      .from('portfolio_categories')
      .insert({
        name: validatedData.name,
        slug: slug,
      })
      .select()
      .single()

    if (error || !data) {
      console.error('Error creating portfolio category:', error)
      return {
        success: false,
        error: 'Failed to create portfolio category',
      }
    }

    return {
      success: true,
      category: data,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    console.error('Portfolio category creation error:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function updatePortfolioCategory(
  id: string,
  formData: PortfolioCategoryFormData
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

    const validatedData = portfolioCategorySchema.parse(formData)

    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Validate that slug is not empty
    if (!slug) {
      return {
        success: false,
        error: 'Category name must contain at least one alphanumeric character',
      }
    }

    // Check if category with same name already exists (excluding current category)
    const { data: existingCategory } = await supabaseAdmin
      .from('portfolio_categories')
      .select('id')
      .eq('name', validatedData.name)
      .neq('id', id)
      .single()

    if (existingCategory) {
      return {
        success: false,
        error: 'Category with this name already exists',
      }
    }

    // Check if slug already exists (excluding current category)
    const { data: existingSlug } = await supabaseAdmin
      .from('portfolio_categories')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single()

    if (existingSlug) {
      return {
        success: false,
        error: 'Category with similar name already exists',
      }
    }

    const { data, error } = await supabaseAdmin
      .from('portfolio_categories')
      .update({
        name: validatedData.name,
        slug: slug,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      console.error('Error updating portfolio category:', error)
      return {
        success: false,
        error: 'Failed to update portfolio category',
      }
    }

    return {
      success: true,
      category: data,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }
    console.error('Portfolio category update error:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}

export async function deletePortfolioCategory(id: string) {
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

    // First, get the category name
    const { data: category } = await supabaseAdmin
      .from('portfolio_categories')
      .select('name')
      .eq('id', id)
      .single()

    if (!category) {
      return {
        success: false,
        error: 'Category not found',
      }
    }

    // Check if category has associated projects (by category name, not ID)
    const { data: projects } = await supabaseAdmin
      .from('portfolio_projects')
      .select('id')
      .eq('category', category.name)
      .limit(1)

    if (projects && projects.length > 0) {
      return {
        success: false,
        error: 'Cannot delete category with associated projects',
      }
    }

    const { error } = await supabaseAdmin
      .from('portfolio_categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting portfolio category:', error)
      return {
        success: false,
        error: 'Failed to delete portfolio category',
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Portfolio category deletion error:', error)
    return {
      success: false,
      error: 'An error occurred',
    }
  }
}
