import { api } from '@/lib/api'
import { SellerT, UserT } from '@/types/types'

const token = localStorage.getItem('access_token')

export const getAllUsers = async (): Promise<UserT[]> => {
	const res = await api.get('/admin/get-all-users', {
		headers: { Authorization: `Bearer ${token}` },
	})
	return res.data
}
export const getAllSellers = async (): Promise<SellerT[]> => {
	const res = await api.get('/admin/get-all-sallers', {
		headers: { Authorization: `Bearer ${token}` },
	})
	return res.data
}

export const createUser = async (data: {
	fullName: string
	email: string
	phone: string
	password: string
}) => {
	await api.post('http://34.229.90.146:3000/admin/create-user', data, {
		headers: { Authorization: `Bearer ${token}` },
	})
}

export const createSeller = async (data: {
	fullName: string
	phone: string
	email: string
	password: string
	businessName: string
	experience: string
	address: string
}) => {
	await api.post('http://34.229.90.146:3000/admin/create-saller', data, {
		headers: { Authorization: `Bearer ${token}` },
	})
}

export const deleteUser = async (id: number) => {
	await api.delete(`http://34.229.90.146:3000/admin/delete-user/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	})
}

export const deleteSeller = async (id: number) => {
	await api.delete(`http://34.229.90.146:3000/admin/delete-saller/${id}`, {
		headers: { Authorization: `Bearer ${token}` },
	})
}
