import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
	ArrowLeft,
	LogOut,
	Trash2,
	CheckCircle,
	AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-toastify'
import { getProfile, deleteUser } from '@/services/auth'
import { RoleType } from '@/services/auth'

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

export default function Profile() {
	const [user, setUser] = useState<UserProfile>({
		id: localStorage.getItem('userId') || '',
		fullName: localStorage.getItem('email') || '',
		email: localStorage.getItem('email') || '',
		phone: '',
		role: (localStorage.getItem('role') as RoleType | 'admin') || 'user',
		sellerInfo: localStorage.getItem('sellerInfo')
			? JSON.parse(localStorage.getItem('sellerInfo')!)
			: undefined,
	})
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const role = localStorage.getItem('role') as RoleType | 'admin' | null
				if (!role) {
					toast.error('Foydalanuvchi roli topilmadi', {
						icon: <AlertCircle className='w-5 h-5 text-red-500' />,
					})
					navigate('/auth')
					return
				}
				if (role === 'admin') {
					setUser({
						id: localStorage.getItem('userId') || '',
						fullName: 'Admin',
						email: localStorage.getItem('email') || '',
						phone: '',
						role: 'admin',
					})
					setLoading(false)
					return
				}
				const profile = await getProfile(role)
				setUser(prev => ({
					...prev,
					fullName: profile.fullName || prev.fullName,
					email: profile.email || prev.email,
					phone: profile.phone || prev.phone,
					role,
				}))
			} catch (err) {
				toast.error(err.message || 'Profil ma’lumotlarni olishda xatolik', {
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				})
				navigate('/auth')
			} finally {
				setLoading(false)
			}
		}
		fetchProfile()
	}, [navigate])

	const handleLogout = () => {
		localStorage.clear()
		toast.success('Tizimdan chiqdingiz', {
			icon: <CheckCircle className='w-5 h-5 text-forest' />,
		})
		navigate('/auth')
	}

	const handleDeleteAccount = async () => {
		if (!confirm('Haqiqatan hisobingizni o`chirishni xohlaysizmi?')) return
		if (!user.id) {
			toast.error('Foydalanuvchi ID si topilmadi', {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
			return
		}
		try {
			await deleteUser(user.id, user.role as RoleType)
			localStorage.clear()
			toast.success('Hisob muvaffaqiyatli o`chirildi', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
			navigate('/auth')
		} catch (err) {
			toast.error(err.message || 'Hisobni o`chirishda xatolik', {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
		}
	}

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-muted p-4 sm:p-6'>
				<p className='text-forest text-sm sm:text-lg'>
					Ma’lumotlar yuklanmoqda...
				</p>
			</div>
		)
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-muted p-4 sm:p-6'>
			<Card className='w-full max-w-md sm:max-w-lg border-forest/20'>
				<CardHeader>
					<div className='flex items-center justify-between flex-col sm:flex-row gap-2'>
						<CardTitle className='text-lg sm:text-xl font-bold text-forest'>
							Profil
						</CardTitle>
						<Link
							to='/'
							className='inline-flex items-center text-forest hover:text-forest/80 text-xs sm:text-sm'
						>
							<ArrowLeft className='w-4 h-4 mr-2' /> Bosh sahifaga qaytish
						</Link>
					</div>
					<p className='text-xs sm:text-sm text-muted-foreground'>
						Shaxsiy ma’lumotlaringiz
					</p>
				</CardHeader>
				<CardContent className='space-y-6'>
					<div className='space-y-2 text-xs sm:text-sm'>
						<div className='flex flex-col sm:flex-row sm:items-center'>
							<span className='w-full sm:w-1/3 font-medium text-forest'>
								Ism:
							</span>
							<span className='text-forest'>{user.fullName || 'Noma’lum'}</span>
						</div>
						<div className='flex flex-col sm:flex-row sm:items-center'>
							<span className='w-full sm:w-1/3 font-medium text-forest'>
								Email:
							</span>
							<span className='text-forest'>{user.email || 'Noma’lum'}</span>
						</div>
						<div className='flex flex-col sm:flex-row sm:items-center'>
							<span className='w-full sm:w-1/3 font-medium text-forest'>
								Telefon:
							</span>
							<span className='text-forest'>{user.phone || 'Noma’lum'}</span>
						</div>
						<div className='flex flex-col sm:flex-row sm:items-center'>
							<span className='w-full sm:w-1/3 font-medium text-forest'>
								Rol:
							</span>
							<span className='text-forest'>
								{user.role === 'user'
									? 'Foydalanuvchi'
									: user.role === 'seller'
									? 'Sotuvchi'
									: user.role === 'admin'
									? 'Admin'
									: 'Noma’lum'}
							</span>
						</div>
						<div className='flex flex-col sm:flex-row sm:items-center'>
							<span className='w-full sm:w-1/3 font-medium text-forest'>
								ID:
							</span>
							<span className='text-forest'>{user.id || 'Noma’lum'}</span>
						</div>
					</div>

					{user.role === 'seller' && user.sellerInfo && (
						<div className='border-t pt-4 space-y-2 border-forest/20 text-xs sm:text-sm'>
							<h3 className='font-semibold text-forest'>
								Qo`shimcha ma’lumotlar:
							</h3>
							<div className='flex flex-col sm:flex-row sm:items-center'>
								<span className='w-full sm:w-1/3 font-medium text-forest'>
									Biznes nomi:
								</span>
								<span className='text-forest'>
									{user.sellerInfo.businessName || 'Noma’lum'}
								</span>
							</div>
							<div className='flex flex-col sm:flex-row sm:items-center'>
								<span className='w-full sm:w-1/3 font-medium text-forest'>
									Manzil:
								</span>
								<span className='text-forest'>
									{user.sellerInfo.address || 'Noma’lum'}
								</span>
							</div>
							<div className='flex flex-col sm:flex-row sm:items-center'>
								<span className='w-full sm:w-1/3 font-medium text-forest'>
									Tajriba:
								</span>
								<span className='text-forest'>
									{user.sellerInfo.experience
										? `${user.sellerInfo.experience} yil`
										: 'Noma’lum'}
								</span>
							</div>
						</div>
					)}

					<div className='flex flex-col gap-2 pt-4 border-t border-forest/20'>
						{user.role !== 'admin' && (
							<Button
								onClick={handleDeleteAccount}
								variant='destructive'
								className='w-full bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm'
							>
								<Trash2 className='w-4 h-4 mr-2' /> Hisobni o`chirish
							</Button>
						)}
						<Button
							onClick={handleLogout}
							variant='outline'
							className='w-full border-forest/20 text-forest hover:bg-sage/20 text-xs sm:text-sm'
						>
							<LogOut className='w-4 h-4 mr-2' /> Chiqish
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
