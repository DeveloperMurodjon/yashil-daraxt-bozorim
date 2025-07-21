import { api } from '@/lib/api'

interface RegisterPayload {
	fullName: string
	email: string
	phone: string
	password: string
}

export async function registerUser(
	data: RegisterPayload,
	type: 'buyer' | 'seller'
) {
	const endpoint = type === 'seller' ? '/saller/register' : '/user/register'
	return (await api.post(endpoint, data)).data
}

export async function requestOtp(data: { email: string }) {
	return (await api.post('/user/request-otp', data)).data
}

export async function loginUser(
	data: { email: string; password: string; otp: string },
	type: 'buyer' | 'seller'
) {
	const endpoint = type === 'seller' ? '/auth/saller/login' : '/auth/user/login'
	return (await api.post(endpoint, data)).data
}
