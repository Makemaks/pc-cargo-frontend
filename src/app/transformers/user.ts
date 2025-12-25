import type { User } from '@/app/types/user'

export default {
  /**
   * Transform a single user record
   */
  fetch(data: any): User {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  },

  /**
   * Transform a collection of users
   */
  fetchCollection(data: any[]): User[] {
    return data.map(this.fetch)
  },
}
