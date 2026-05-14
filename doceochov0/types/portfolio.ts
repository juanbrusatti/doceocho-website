export interface PortfolioProject {
  id: string
  title: string | null
  category: 'Residencial' | 'Comercial' | 'Mobiliario'
  created_at: string
  updated_at: string
}

export interface PortfolioProjectImage {
  id: string
  project_id: string
  image_path: string
  order_index: number
  created_at: string
}

export interface PortfolioProjectWithImages extends PortfolioProject {
  images: PortfolioProjectImage[]
}
