'use client'

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

export default function Profile() {
	const [user, setUser] = useState({
		email: '',
		role: '',
		userId: '',
	})

	const [sellerInfo, setSellerInfo] = useState({
		businessName: '',
		address: '',
		region: '',
		experience: '',
	})

	const navigate = useNavigate()

	useEffect(() => {
		const email = localStorage.getItem('email') || ''
		const role = localStorage.getItem('role') || ''
		const userId = localStorage.getItem('userId') || ''

		setUser({ email, role, userId })

		if (role === 'seller') {
			setSellerInfo({
				businessName: localStorage.getItem('businessName') || '',
				address: localStorage.getItem('address') || '',
				region: localStorage.getItem('region') || '',
				experience: localStorage.getItem('experience') || '',
			})
		}
	}, [])

	const handleDeleteAccount = async () => {
		if (!window.confirm('Hisobingizni butunlay o`chirmoqchimisiz?')) return

		try {
			const token = localStorage.getItem('access_token')
			if (!token) throw new Error('Token topilmadi')

			const endpoint =
				user.role === 'buyer'
					? `/user/${user.userId}`
					: `/saller/${user.userId}`

			await api.delete(endpoint, {
				headers: { Authorization: `Bearer ${token}` },
			})

			localStorage.clear()
			alert('Hisob o`chirildi.')
			navigate('/auth')
		} catch (err: any) {
			alert(err.response?.data?.error?.message || err.message)
		}
	}

	const handleLogout = () => {
		localStorage.clear()
		navigate('/auth')
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-muted px-4'>
			<div className='w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6'>
				<Link
					to='/'
					className='inline-flex items-center text-forest hover:text-forest-light text-sm'
				>
					<ArrowLeft className='w-4 h-4 mr-2' />
					Bosh sahifaga qaytish
				</Link>

				<div className='text-center space-y-1'>
					<h2 className='text-2xl font-bold text-forest'>Profil</h2>
					<p className='text-muted-foreground'>Shaxsiy ma’lumotlaringiz</p>
				</div>

				<div className='space-y-2'>
					<p>
						<strong>Email:</strong> {user.email}
					</p>
					<p>
						<strong>Rol:</strong>{' '}
						{user.role === 'buyer' ? 'Xaridor' : 'Sotuvchi'}
					</p>
					<p>
						<strong>ID:</strong> {user.userId}
					</p>

					{user.role === 'seller' && (
						<div className='mt-4 border-t pt-4 space-y-2'>
							<h3 className='font-semibold text-forest'>
								Qo`shimcha ma’lumotlar:
							</h3>
							<p>
								<strong>Biznes nomi:</strong> {sellerInfo.businessName}
							</p>
							<p>
								<strong>Manzil:</strong> {sellerInfo.address}
							</p>
							<p>
								<strong>Viloyat:</strong> {sellerInfo.region}
							</p>
							<p>
								<strong>Tajriba:</strong> {sellerInfo.experience} yil
							</p>
						</div>
					)}
				</div>

				<div className='flex flex-col gap-2 pt-4 border-t border-border'>
					<Button
						onClick={handleLogout}
						variant='outline'
						className='w-full flex items-center justify-center gap-2'
					>
						<LogOut className='w-4 h-4' />
						Chiqish
					</Button>

					<Button
						onClick={handleDeleteAccount}
						variant='destructive'
						className='w-full flex items-center justify-center gap-2'
					>
						<Trash2 className='w-4 h-4' />
						Hisobni o`chirish
					</Button>
				</div>
			</div>
		</div>
	)
}
