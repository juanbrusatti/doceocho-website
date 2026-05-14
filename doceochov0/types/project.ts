export interface Project {
  id: string
  title: string
  category: 'Residencial' | 'Comercial' | 'Mobiliario'
  description: string
  image_path: string
  year: string
  size: 'large' | 'small'
  created_at: string
  updated_at: string
}
