export type UserProfileDTO = {
	id: number
	first_name: string
	second_name: string
	display_name: string | null
	login: string
	email: string
	phone: string
	avatar: string | null
}

export type UpdateProfileData = {
	first_name: string
	second_name: string
	display_name?: string | null
	login: string
	email: string
	phone: string
}
