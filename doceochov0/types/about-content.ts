export interface AboutContent {
  id: string
  title: string
  description: string
  quote: string
  stats: {
    value: string
    label: string
  }[]
  image_path: string
  created_at: string
  updated_at: string
}
