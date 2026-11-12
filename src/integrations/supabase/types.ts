export type Database = {
  public: {
    Tables: {
      synthesized_intelligences: {
        Row: {
          id: string
          source_key: string
          source_ids: string[]
          name: string
          type: string
          essence: string
          power: string
          roles: string[]
          quote: string
          key_question: string | null
          visual_prompt: string | null
          image_url: string | null
          times_found: number
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          source_key: string
          source_ids: string[]
          name: string
          type: string
          essence: string
          power: string
          roles?: string[]
          quote: string
          key_question?: string | null
          visual_prompt?: string | null
          image_url?: string | null
          times_found?: number
          source?: string
          created_at?: string
        }
        Update: {
          id?: string
          source_key?: string
          source_ids?: string[]
          name?: string
          type?: string
          essence?: string
          power?: string
          roles?: string[]
          quote?: string
          key_question?: string | null
          visual_prompt?: string | null
          image_url?: string | null
          times_found?: number
          source?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_times_found: {
        Args: { p_source_key: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
