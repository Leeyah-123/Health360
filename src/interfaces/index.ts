import type { Gender, Role } from '@/utils/types/misc'

export interface UserInterface {
  id: string
  full_name: string
  country: string
  country_code: string
  phone_number: string
  age?: number
  gender?: Gender
  role: Role
  created_at: string
  updated_at: string
}

export interface ConsultantInterface {
  id: string
  user_id: string
  services: string[]
  specialization: string[]
  user: UserInterface
  created_at: string
  updated_at: string
}
