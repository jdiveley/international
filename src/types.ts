export interface Recipe {
  country: string
  flag: string
  dish: string
  description: string
  prepTime: string
  cookTime: string
  totalTime: string
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  ingredients: string[]
  instructions: string[]
  tips?: string[]
  notes?: string
}

export interface BlogPost {
  id: string
  country: string
  dish: string
  weekNumber: number
  date: string
  title: string
  content: string
  rating: number // 1-5
  photos?: string[] // base64 data URLs
}
