export interface TestimonialPhrase {
  id: string
  quote: string
  emphasis: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  order_index: number
  created_at: string
  updated_at: string
}
