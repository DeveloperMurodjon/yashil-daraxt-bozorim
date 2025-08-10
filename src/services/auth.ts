import { api } from '@/lib/api'
import { toast } from 'react-toastify'

// Role types
export type RoleType = 'user' | 'seller'

interface RegisterPayload {
	fullName: string
	email: string
	phone: string
	password: string
	businessName?: string
	experience?: string
	addres?: string
}
interface SignInT {
	email: string
	otp: string
}
interface SellerInfo {
	businessName: string
	addres: string
	experience: string
}
interface ForgotPasswordPayload {
	email: string
}
interface ResetPasswordPayload {
	email: string
	password: string
	otp: string
}

export interface UserProfile {
	id: string
	fullName: string
	email: string
	phone: string
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

// localStorage setItems
const saveUserData = (data: Partial<UserProfile> & { token?: string }) => {
	try {
		if (data.id) localStorage.setItem('userId', data.id)
		if (data.email) localStorage.setItem('email', data.email)
		if (data.fullName) localStorage.setItem('fullName', data.fullName)
		if (data.phone) localStorage.setItem('phone', data.phone)
		if (data.addres) localStorage.setItem('addres', data.addres)
		if (data.role) localStorage.setItem('role', data.role)
		if (data.token) localStorage.setItem('access_token', data.token)
		if (data.sellerInfo)
			localStorage.setItem('sellerInfo', JSON.stringify(data.sellerInfo))
	} catch (error) {
		console.error("Ma'lumotlarni localStorage'ga saqlashda xato:", error)
	}
}

// localStorage
const getStoredUserData = (): Partial<UserProfile> => {
	let sellerInfo: SellerInfo | undefined
	try {
		const sellerInfoRaw = localStorage.getItem('sellerInfo')
		sellerInfo = sellerInfoRaw ? JSON.parse(sellerInfoRaw) : undefined
	} catch (error) {
		console.error('sellerInfo parse qilishda xato:', error)
	}

	return {
		id: localStorage.getItem('userId') || '',
		email: localStorage.getItem('email') || '',
		fullName: localStorage.getItem('fullName') || '',
		phone: localStorage.getItem('phone') || '',
		addres: localStorage.getItem('addres') || '',
		role: (localStorage.getItem('role') as RoleType | 'admin') || 'user',
		sellerInfo,
	}
}

const getErrorMessage = (error): string => {
	return (
		error.response?.data?.error?.message ||
		error.response?.error?.message ||
		error.message ||
		"Noma'lum xato yuz berdi"
	)
}

// Register
export async function registerUser(data: RegisterPayload, type: RoleType) {
	const endpoint = type === 'seller' ? '/saller/register' : '/user/register'
	try {
		const res = await api.post(endpoint, data)

		const userData: Partial<UserProfile> & { token?: string } = {
			...data,
			role: type,
			id: res.data.id,
			sellerInfo:
				type === 'seller'
					? {
							businessName: data.businessName || '',
							addres: data.addres || '',
							experience: data.experience || '',
					  }
					: undefined,
		}
		saveUserData(userData)
		return res.data
	} catch (error) {
		console.error({
			message: error.message,
			response: error.response?.data || error.response,
			status: error.response?.status,
		})
		throw new Error(
			getErrorMessage(error) || "Ro'yxatdan o'tishda xato yuz berdi"
		)
	}
}

// Confirm SignIn
export async function confirmSignIn(data: SignInT, type: RoleType) {
	const endpoint =
		type === 'seller'
			? '/auth/saller/confirm-signin'
			: type === 'user'
			? '/auth/user/confirm-signin'
			: ''
	try {
		const res = await api.post(endpoint, data)
		const token = res.data.access_token
		// if (!token) throw new Error('Token topilmadi')

		saveUserData({
			email: data.email,
			role: type,
			token,
			id: res.data.id || res.data.userId,
		})
		return res.data
	} catch (error) {
		console.log('Ro`yxatdan o`tishda xato', {
			message: error.message,
			response: error.response?.data || error.response,
			status: error.response?.status,
		})
		throw new Error(getErrorMessage(error) || 'Kirishda xato yuz berdi')
	}
}

// OTP request
export async function requestOtp(data: { email: string }, type: RoleType) {
	const endpoint =
		type === 'seller' ? '/saller/request-otp' : '/user/request-otp'
	try {
		const res = await api.post(endpoint, data)
		return res.data
	} catch (error) {
		console.error("OTP so'rashda xato:", {
			message: error.message,
			response: error.response?.data || error.response,
			status: error.response?.status,
		})
		throw new Error(getErrorMessage(error) || "OTP so'rashda xato yuz berdi")
	}
}

// Forgot Password OTP request
export async function requestForgotPasswordOtp(
	data: ForgotPasswordPayload,
	type: RoleType
) {
	const endpoint =
		type === 'seller'
			? '/auth/saller/forgot-password'
			: '/auth/user/forgot-password'
	try {
		const res = await api.post(endpoint, data)
		return res.data
	} catch (error) {
		console.error("Parolni tiklash OTP so'rashda xato:", {
			message: error.message,
			response: error.response?.data || error.response,
			status: error.response?.status,
		})
		throw new Error(
			getErrorMessage(error) || "Parolni tiklash OTP so'rashda xato yuz berdi"
		)
	}
}

// Reset Password
export async function resetPassword(
	data: ResetPasswordPayload,
	type: RoleType
) {
	const endpoint =
		type === 'seller'
			? '/auth/saller/reset-password'
			: '/auth/user/reset-password'
	try {
		const res = await api.post(endpoint, data)
		return res.data
	} catch (error) {
		console.error('Parolni yangilashda xato:', {
			message: error.message,
			response: error.response?.data || error.response,
			status: error.response?.status,
		})
		throw new Error(
			getErrorMessage(error) || 'Parolni yangilashda xato yuz berdi'
		)
	}
}

// Login
export async function loginUser(
	data: { email: string; password: string },
	type: RoleType
) {
	const endpoint = type === 'seller' ? '/auth/saller/login' : '/auth/user/login'
	try {
		const res = await api.post(endpoint, data)
		const token = res.data.access_token
		// if (!token) throw new Error('saller')

		saveUserData({
			email: data.email,
			role: type,
			token,
			id: res.data.id || res.data.userId,
		})
		return res.data
	} catch (error) {
		console.error('Kirishda xato:', {
			message: error.message,
			response: error.response?.data || error.response,
			status: error.response?.status,
		})
		throw new Error(getErrorMessage(error) || 'Kirishda xato yuz berdi')
	}
}

// get Profile datas
export async function getProfile(
	type: RoleType | 'admin'
): Promise<UserProfile> {
	const token = localStorage.getItem('access_token')
	if (!token) throw new Error('Avtorizatsiya tokeni topilmadi')
	const endpoint =
		type === 'seller'
			? '/auth/saller/profile'
			: type === 'admin'
			? '/auth/admin/profile'
			: '/auth/user/profile'
	try {
		const res = await api.get(endpoint, {
			headers: { Authorization: `Bearer ${token}` },
		})
		const storedData = getStoredUserData()
		const userData: UserProfile = {
			id: res.data.id || storedData.id || '',
			fullName: res.data.fullName || storedData.fullName || '',
			email: res.data.email || storedData.email || '',
			phone: res.data.phone || storedData.phone || '',
			addres: res.data.addres || storedData.addres || '',
			role: type,
			sellerInfo: res.data.sellerInfo || storedData.sellerInfo,
		}
		saveUserData(userData)
		return userData
	} catch (error) {
		console.error('Profilni olishda xato:', {
			message: error.message,
			response: error.response?.data || error.response,
			status: error.response?.status,
		})
		throw new Error(getErrorMessage(error) || 'Profilni olishda xato yuz berdi')
	}
}

// Update user
export async function updateUserProfile(
	id: string,
	data: {
		fullName?: string
		email?: string
		phone?: string
		addres?: string
		password?: string
	}
): Promise<UserProfile> {
	const token = localStorage.getItem('access_token')
	if (!token) throw new Error('Avtorizatsiya tokeni topilmadi')
	try {
		const response = await api.patch(`/user/${id}`, data, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (!response.data?.id) throw new Error('Foydalanuvchi ID topilmadi')

		const userData: UserProfile = {
			id: response.data.id,
			fullName: response.data.fullName || '',
			email: response.data.email || '',
			phone: response.data.phone || '',
			addres: response.data.addres || '',
			role: response.data.role || 'user',
			sellerInfo: response.data.sellerInfo,
		}
		saveUserData(userData)
		return userData
	} catch (error) {
		console.error('Profilni yangilashda xato:', {
			message: error.message,
			response: error.response?.data || error.response,
			status: error.response?.status,
		})
		throw new Error(
			getErrorMessage(error) || 'Profilni yangilashda xato yuz berdi'
		)
	}
}

// Update seller
export async function updateSellerProfile(
	id: string,
	data: UpdateSellerProfilePayload
): Promise<UserProfile> {
	const token = localStorage.getItem('access_token')
	if (!token) throw new Error('Avtorizatsiya tokeni topilmadi')
	try {
		const response = await api.patch(`/saller/${id}`, data, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (!response.data?.id) throw new Error('Foydalanuvchi ID topilmadi')

		const userData: UserProfile = {
			id: response.data.id,
			fullName: response.data.fullName || '',
			email: response.data.email || '',
			phone: response.data.phone || '',
			addres: response.data.addres || '',
			role: 'seller',
			sellerInfo: {
				businessName: response.data.businessName || '',
				addres: response.data.addres || '',
				experience: response.data.experience || '',
			},
		}
		saveUserData(userData)
		return userData
	} catch (error) {
		console.error('Sotuvchi profilini yangilashda xato:', {
			message: error.message,
			response: error.response?.data || error.response,
			status: error.response?.status,
		})
		throw new Error(
			getErrorMessage(error) || 'Sotuvchi profilini yangilashda xato yuz berdi'
		)
	}
}

// Delete Seller
export async function deleteUser(id: string, type: RoleType) {
	const token = localStorage.getItem('access_token')
	if (!token) throw new Error('Avtorizatsiya tokeni topilmadi')
	const endpoint = type === 'seller' ? `/saller/${id}` : `/user/${id}`
	try {
		const res = await api.delete(endpoint, {
			headers: { Authorization: `Bearer ${token}` },
		})

		localStorage.removeItem('userId')
		localStorage.removeItem('email')
		localStorage.removeItem('fullName')
		localStorage.removeItem('phone')
		localStorage.removeItem('addres')
		localStorage.removeItem('role')
		localStorage.removeItem('access_token')
		localStorage.removeItem('sellerInfo')
		return res.data
	} catch (error) {
		console.error("Foydalanuvchi o'chirishda xato:", {
			message: error.message,
			response: error.response?.data || error.response,
			status: error.response?.status,
		})
		throw new Error(
			getErrorMessage(error) || "Foydalanuvchi o'chirishda xato yuz berdi"
		)
	}
}
