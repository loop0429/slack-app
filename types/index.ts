export type LoginUser = {
  email: string
  password: string
}

export type Channels = {
  id: number
  inserted_at: Date
  slug: string
  created_by: Date
}

type Users = {
  id: string
  username: string
  status: string
  display_name: string
  avatar_image: string
}

export type Messages = {
  id: number
  inserted_at: Date
  message: string
  user_id: string
  channel_id: number
  user: Users
}
