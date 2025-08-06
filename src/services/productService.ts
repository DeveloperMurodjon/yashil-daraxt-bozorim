import { Product, Order, UserProfile } from '@/types/types'
import { api } from '@/lib/api'

api.interceptors.request.use(config => {
	const token = localStorage.getItem('access_token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

export interface FilterResponse {
	data: Product[]
	total: number
	page: number
	limit: number
	totalPages: number
}

export interface Favorite {
	id: number
	createdAt: string
	updatedAt: string
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

export interface LikeResponse {
	message: string
	liked: boolean
}

// Get all products
export const getProducts = async (): Promise<Product[]> => {
	try {
		const response = await api.get('/saller/products')
		return response.data
	} catch (error) {
		console.error('Mahsulotlarni yuklashda xatolik:', error)
		throw error
	}
}

// User's sent order
export const createOrder = async (orderData: {
	userId: number
	productId: number
	quantity: number
}): Promise<Order> => {
	try {
		const response = await api.post('/user/order', orderData)
		return response.data
	} catch (error) {
		console.error('Buyurtma berishda xatolik:', error)
		throw error
	}
}

// User products filter
export const filterProducts = async (
	params: Record<string, string>
): Promise<FilterResponse> => {
	try {
		const query = new URLSearchParams(params).toString()
		const response = await api.get(`/user/filter?${query}`)
		return response.data
	} catch (error) {
		console.error('Filterlashda xatolik:', error)
		throw error
	}
}

// Get user's orders
export const getUserOrders = async (): Promise<Order[]> => {
	try {
		const response = await api.get('/user/my-orders')
		return response.data
	} catch (error) {
		console.error('Foydalanuvchi buyurtmalarini yuklashda xatolik:', error)
		throw error
	}
}

// Get user's favorites
export const getUserFavorites = async (): Promise<Favorite[]> => {
	try {
		const response = await api.get('/user/my-favorites')
		return response.data
	} catch (error) {
		console.error('Sevimlilarni yuklashda xatolik:', error)
		throw error
	}
}

// Toggle like/dislike
export const toggleLike = async (productId: number): Promise<LikeResponse> => {
	try {
		const response = await api.post('/like', { productId })
		return response.data
	} catch (error) {
		console.error('Like/dislike qilishda xatolik:', error)
		throw error
	}
}

// Get seller's orders
export const getMyOrders = async (): Promise<Order[]> => {
	try {
		const response = await api.get('/saller/my-orders')
		return response.data
	} catch (error) {
		console.error('Sotuvchi buyurtmalarini yuklashda xatolik:', error)
		throw error
	}
}

// Get seller's own products
export const getMyProducts = async (): Promise<Product[]> => {
	try {
		const response = await api.get('/saller/my-products')
		return response.data
	} catch (error) {
		console.error('Mahsulotlarni yuklashda xatolik:', error)
		throw error
	}
}

// Create product (seller)
export const createProduct = async (formData: FormData): Promise<Product> => {
	try {
		const response = await api.post('/saller/post-product', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		return response.data
	} catch (error) {
		const errorMessages = error.response?.data?.error?.message || [
			'Noma`lum xatolik',
		]
		console.error('Mahsulot yaratishda xatolik:', {
			status: error.response?.status || 'Noma`lum',
			messages: errorMessages,
			fullError: error.response?.data || error,
		})
		throw new Error(
			Array.isArray(errorMessages) ? errorMessages.join(', ') : errorMessages
		)
	}
}

// Update product (seller)
export const updateProduct = async (
	productId: number,
	formData: FormData
): Promise<Product> => {
	try {
		const response = await api.patch(`/saller/product/${productId}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
		return response.data
	} catch (error) {
		const errorMessages = error.response?.data?.error?.message || [
			'Noma`lum xatolik',
		]
		console.error('Mahsulotni yangilashda xatolik:', {
			status: error.response?.status || 'Noma`lum',
			messages: errorMessages,
			fullError: error.response?.data || error,
		})
		throw new Error(
			Array.isArray(errorMessages) ? errorMessages.join(', ') : errorMessages
		)
	}
}

// Delete product (seller)
export const deleteProduct = async (productId: number): Promise<void> => {
	try {
		await api.delete(`/saller/product/${productId}`)
	} catch (error) {
		const errorMessages = error.response?.data?.error?.message || [
			'Noma`lum xatolik',
		]
		console.error('Mahsulotni o`chirishda xatolik:', {
			status: error.response?.status || 'Noma`lum',
			messages: errorMessages,
			fullError: error.response?.data || error,
		})
		throw new Error(
			Array.isArray(errorMessages) ? errorMessages.join(', ') : errorMessages
		)
	}
}

// Seller profile APIs
export const getSellerProfile = async (): Promise<UserProfile> => {
	try {
		const response = await api.get('/auth/saller/profile')
		return response.data
	} catch (error) {
		console.error('Profil ma`lumotlarini yuklashda xatolik:', error)
		throw error
	}
}

export const deleteSellerAccount = async (id: string): Promise<void> => {
	try {
		await api.delete(`/saller/${id}`)
	} catch (error) {
		console.error('Hisobni o`chirishda xatolik:', error)
		throw error
	}
}
