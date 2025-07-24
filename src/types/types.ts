// seller types
export interface SellerT {
	id?: number
	fullName: string
	email: string
	phone: string
	businessName: string
	address: string
	experience: string
	role?: string
	password?: string
}

// user types
export interface UserT {
	id: number
	fullName: string
	email: string
	phone: string
	role: string
}

// admin Tabs types
export type AdminTabT = 'users' | 'sellers' | 'createUser' | 'createSeller'
