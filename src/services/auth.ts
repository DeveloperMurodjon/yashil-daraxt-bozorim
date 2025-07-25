import { api } from '@/lib/api'

export type RoleType = 'user' | 'seller'
interface RegisterPayload {
	fullName: string
	email: string
	phone: string
	password: string
	businessName?: string
	experience?: string
	address?: string
}

interface SellerInfo {
	businessName: string
	address: string
	experience: string
}

interface UserProfile {
	id: string
	fullName: string
	email: string
	phone: string
	role: RoleType | 'admin'
	sellerInfo?: SellerInfo
}

const saveUserData = (data: Partial<UserProfile> & { token?: string }) => {
	if (data.id) localStorage.setItem('userId', data.id)
	if (data.email) localStorage.setItem('email', data.email)
	if (data.role) localStorage.setItem('role', data.role)
	if (data.token) localStorage.setItem('access_token', data.token)
	if (data.sellerInfo)
		localStorage.setItem('sellerInfo', JSON.stringify(data.sellerInfo))
}

const getStoredUserData = (): Partial<UserProfile> => ({
	id: localStorage.getItem('userId') || '',
	email: localStorage.getItem('email') || '',
	role: (localStorage.getItem('role') as RoleType | 'admin') || 'user',
	sellerInfo: localStorage.getItem('sellerInfo')
		? JSON.parse(localStorage.getItem('sellerInfo')!)
		: undefined,
})

export async function registerUser(data: RegisterPayload, type: RoleType) {
	const endpoint = type === 'seller' ? '/saller/register' : '/user/register'
	const res = await api.post(endpoint, data)
	saveUserData({
		...data,
		role: type,
		id: res.data.id || '',
		sellerInfo:
			type === 'seller'
				? {
						businessName: data.businessName || '',
						address: data.address || '',
						experience: data.experience || '',
				  }
				: undefined,
	})
	return res.data
}

export async function requestOtp(data: { email: string }, type: RoleType) {
	const endpoint =
		type === 'seller' ? '/saller/request-otp' : '/user/request-otp'
	return (await api.post(endpoint, data)).data
}

export async function loginUser(
	data: { email: string; password: string; otp: string },
	type: RoleType
) {
	const endpoint = type === 'seller' ? '/auth/saller/login' : '/auth/user/login'
	const res = await api.post(endpoint, data)
	saveUserData({
		email: data.email,
		role: type,
		token: res.data.token || res.data.access_token,
		id: res.data.id || res.data.userId || '',
	})
	return res.data
}

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
	const res = await api.get(endpoint, {
		headers: { Authorization: `Bearer ${token}` },
	})
	const storedData = getStoredUserData()
	return {
		id: storedData.id || '',
		fullName: res.data.fullName || storedData.fullName || '',
		email: res.data.email || storedData.email || '',
		phone: res.data.phone || storedData.phone || '',
		role: type,
		sellerInfo: storedData.sellerInfo,
	}
}

export async function deleteUser(id: string, type: RoleType) {
	const token = localStorage.getItem('access_token')
	if (!token) throw new Error('Avtorizatsiya tokeni topilmadi')
	const endpoint = type === 'seller' ? `/saller/${id}` : `/user/${id}`
	const res = await api.delete(endpoint, {
		headers: { Authorization: `Bearer ${token}` },
	})
	return res.data
}
