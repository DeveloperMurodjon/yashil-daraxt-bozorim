export interface Image {
	id: number
	createdAt: string
	updatedAt: string
	ImageUrl: string
}

export interface Seller {
	id?: number
	createdAt: string
	updatedAt: string
	fullName: string
	phone: string
	email: string
	password: string
	businessName: string
	addres: string
	experience: string
	accountStatus: string
	role: string
}

export type RoleType = 'user' | 'seller'

export interface SellerInfo {
	businessName: string
	addres: string
	experience: string
}

export interface UserProfile {
	id: string
	fullName: string
	email: string
	phone: string
	password?: string
	role: RoleType | 'admin'
	sellerInfo?: SellerInfo
	addres?: string
}

export interface UpdateSellerProfilePayload {
	fullName?: string
	email?: string
	phone?: string
	password?: string
	businessName?: string
	addres?: string
	experience?: string
}

export interface Order {
	id: number
	createdAt: string
	updatedAt: string
	quantity: number
	totalPrice: string
	status: string
	product: {
		id: number
		createdAt: string
		updatedAt: string
		name: string
		price: number
		deliveryService: string
		stock: number
		height: number
		age: number
		region: string
	}
	user: {
		id: number
		createdAt: string
		updatedAt: string
		fullName: string
		phone: string
		email: string
		password: string
		accountStatus: string
		role: string
	}
}

export interface Image {
	id: number
	createdAt: string
	updatedAt: string
	ImageUrl: string
}

export interface Product {
	id: number
	createdAt: string
	updatedAt: string
	name: string
	price: number
	deliveryService: string
	stock: number
	height: number
	age: number
	region: string
	images?: Image[]
	category: {
		id: number
		createdAt: string
		updatedAt: string
		name: string
	}
	saller?: Seller
}

export interface SellerT {
	id?: number
	fullName: string
	email: string
	phone: string
	businessName: string
	addres: string
	experience: string
	role?: string
	password?: string
	accountStatus?: string
	products?: Product[]
}

export interface UserT {
	id: number
	fullName: string
	email: string
	phone: string
	role: string
}

export type AuthTabT = 'login' | 'register'
export type AdminTabT = 'users' | 'sellers' | 'createUser' | 'createSeller'

export interface RegisterPayload {
	fullName: string
	email: string
	phone: string
	password: string
	businessName?: string
	addres?: string
	experience?: string
}
