import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserProfile } from '@/types/types'
import {
	AlertCircle,
	CheckCircle,
	LogOut,
	Trash2,
	Pencil,
	Eye,
	EyeOff,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { getProfile, deleteUser, updateUserProfile } from '@/services/auth'
import { useEffect, useState } from 'react'

interface ProfileTabProps {
	user: UserProfile
	setUser: (user: UserProfile) => void
	handleLogout: () => void
}

const ProfileTab = ({ user, setUser, handleLogout }: ProfileTabProps) => {
	const [profileLoading, setProfileLoading] = useState(true)
	const [editFields, setEditFields] = useState({
		fullName: false,
		email: false,
		phone: false,
		password: false,
	})
	const [formData, setFormData] = useState({
		fullName: user.fullName,
		email: user.email,
		phone: user.phone,
		password: '',
	})
	const [passwordError, setPasswordError] = useState<string | null>(null)
	const [showPassword, setShowPassword] = useState(false)

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const role = localStorage.getItem('role') as
					| 'user'
					| 'admin'
					| 'seller'
					| null
				if (!role) {
					toast.error('Foydalanuvchi roli topilmadi', {
						icon: <AlertCircle className='w-5 h-5 text-red-500' />,
					})
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
					setProfileLoading(false)
					return
				}
				const profile = await getProfile(role)
				setUser({
					id: profile.id || '',
					fullName: profile.fullName || '',
					email: profile.email || '',
					phone: profile.phone || '',
					role,
				})
				setFormData({
					fullName: profile.fullName || '',
					email: profile.email || '',
					phone: profile.phone || '',
					password: '',
				})
			} catch (err) {
				console.error('Profil ma`lumotlarni olishda xatolik:', {
					message: err.message,
					response: err.response?.data,
					status: err.response?.status,
				})
				if (err.response?.status === 401) {
					localStorage.clear()
					window.location.href = '/auth'
					return
				}
				toast.error(
					err.response?.data?.message || 'Profil ma`lumotlarni olishda xatolik',
					{
						icon: <AlertCircle className='w-5 h-5 text-red-500' />,
					}
				)
			} finally {
				setProfileLoading(false)
			}
		}
		fetchProfile()
	}, [setUser])

	// Parol validation
	const validatePassword = (password: string): string | null => {
		const minLength = password.length >= 8
		const hasUpperCase = /[A-Z]/.test(password)
		const hasLowerCase = /[a-z]/.test(password)
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

		if (!minLength) return 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak'
		if (!hasUpperCase) return 'Parolda kamida bitta katta harf bo‘lishi kerak'
		if (!hasLowerCase) return 'Parolda kamida bitta kichik harf bo‘lishi kerak'
		if (!hasSpecialChar)
			return 'Parolda kamida bitta maxsus belgi bo‘lishi kerak'
		return null
	}

	// Post form
	const handleUpdateProfile = async (field: string) => {
		if (field === 'password' && formData.password) {
			const error = validatePassword(formData.password)
			if (error) {
				setPasswordError(error)
				return
			}
		}

		try {
			const updatedData: {
				fullName?: string
				email?: string
				phone?: string
				password?: string
			} = {}
			if (field === 'fullName' && formData.fullName !== user.fullName)
				updatedData.fullName = formData.fullName
			if (field === 'email' && formData.email !== user.email)
				updatedData.email = formData.email
			if (field === 'phone' && formData.phone !== user.phone)
				updatedData.phone = formData.phone
			if (field === 'password' && formData.password)
				updatedData.password = formData.password

			if (Object.keys(updatedData).length === 0) {
				setEditFields({ ...editFields, [field]: false })
				return
			}

			const updatedProfile = await updateUserProfile(user.id, updatedData)
			setUser({
				...user,
				id: updatedProfile.id,
				fullName: updatedProfile.fullName,
				email: updatedProfile.email,
				phone: updatedProfile.phone,
				role: updatedProfile.role,
			})
			setFormData({
				fullName: updatedProfile.fullName,
				email: updatedProfile.email,
				phone: updatedProfile.phone,
				password: '',
			})
			setEditFields({ ...editFields, [field]: false })
			setPasswordError(null)
			setShowPassword(false)
			toast.success('Ma`lumotlar muvaffaqiyatli yangilandi', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
		} catch (err) {
			console.error('Ma`lumotlarni yangilashda xatolik:', {
				message: err.response?.data?.error?.message,
				response: err.response?.data,
				status: err.response?.status,
			})
			if (err.response?.status === 401) {
				localStorage.clear()
				window.location.href = '/auth'
				return
			}
			toast.error(
				err.response?.data?.error?.message ||
					'Ma`lumotlarni yangilashda xatolik',
				{
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				}
			)
		}
	}

	// Delete Account
	const handleDeleteAccount = async () => {
		if (!confirm('Haqiqatan hisobingizni o‘chirishni xohlaysizmi?')) return
		if (!user.id) {
			toast.error('Foydalanuvchi ID si topilmadi', {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
			return
		}
		try {
			await deleteUser(user.id, user.role as 'user' | 'seller')
			localStorage.clear()
			toast.success('Hisob muvaffaqiyatli o‘chirildi', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
			handleLogout()
		} catch (err) {
			console.error('Hisobni o‘chirishda xatolik:', {
				message: err.message,
				response: err.response?.data,
				status: err.response?.status,
			})
			if (err.response?.status === 401) {
				localStorage.clear()
				window.location.href = '/auth'
				return
			}
			toast.error(
				err.response?.data?.message || 'Hisobni o‘chirishda xatolik',
				{
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				}
			)
		}
	}

	// Edit
	const startEditing = (field: string) => {
		setEditFields({ ...editFields, [field]: true })
		setPasswordError(null)
	}

	// Input change
	const handleInputChange = (field: string, value: string) => {
		setFormData({ ...formData, [field]: value })
		if (field === 'password') {
			setPasswordError(null)
		}
	}

	return (
		<div className='space-y-2'>
			<h2 className='text-2xl font-bold text-forest'>Profil</h2>
			{profileLoading ? (
				<p className='text-center text-forest'>Ma`lumotlar yuklanmoqda...</p>
			) : (
				<Card className='shadow-card'>
					<CardHeader>
						<CardTitle className='text-forest'>Shaxsiy Ma'lumotlar</CardTitle>
						<CardDescription>
							O'zingiz haqingizda ma'lumotlarni yangilang
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='profile-first-name'>Ism Familiya</Label>
								{editFields.fullName ? (
									<div className='flex items-center gap-2'>
										<Input
											id='profile-first-name'
											value={formData.fullName}
											onChange={e =>
												handleInputChange('fullName', e.target.value)
											}
											autoFocus
										/>
										<Button
											type='button'
											size='sm'
											className='bg-forest hover:bg-forest/80'
											onClick={() => handleUpdateProfile('fullName')}
										>
											Saqlash
										</Button>
									</div>
								) : (
									<div className='flex items-center gap-2'>
										<span className='border p-2 rounded-md w-full'>
											{user.fullName || 'Kiritilmagan'}
										</span>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => startEditing('fullName')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									</div>
								)}
							</div>
							<div className='space-y-2'>
								<Label htmlFor='profile-email'>Email</Label>
								{editFields.email ? (
									<div className='flex items-center gap-2'>
										<Input
											id='profile-email'
											type='email'
											value={formData.email}
											onChange={e => handleInputChange('email', e.target.value)}
											autoFocus
										/>
										<Button
											type='button'
											size='sm'
											className='bg-forest hover:bg-forest/80'
											onClick={() => handleUpdateProfile('email')}
										>
											Saqlash
										</Button>
									</div>
								) : (
									<div className='flex items-center gap-2'>
										<span className='border p-2 rounded-md w-full'>
											{user.email || 'Kiritilmagan'}
										</span>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => startEditing('email')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									</div>
								)}
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
							<div className='space-y-2'>
								<Label htmlFor='profile-phone'>Telefon</Label>
								{editFields.phone ? (
									<div className='flex items-center gap-2'>
										<Input
											id='profile-phone'
											value={formData.phone}
											onChange={e => handleInputChange('phone', e.target.value)}
											autoFocus
										/>
										<Button
											type='button'
											size='sm'
											className='bg-forest hover:bg-forest/80'
											onClick={() => handleUpdateProfile('phone')}
										>
											Saqlash
										</Button>
									</div>
								) : (
									<div className='flex items-center gap-2'>
										<span className='border p-2 rounded-md w-full'>
											{user.phone || 'Kiritilmagan'}
										</span>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => startEditing('phone')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									</div>
								)}
							</div>
							<div className='space-y-2'>
								<Label htmlFor='profile-password'>Parol</Label>
								{editFields.password ? (
									<div className='space-y-2'>
										<div className='flex items-center gap-2'>
											<div className='relative w-full'>
												<Input
													id='profile-password'
													type={showPassword ? 'text' : 'password'}
													value={formData.password}
													onChange={e =>
														handleInputChange('password', e.target.value)
													}
													placeholder='Yangi parol'
													autoFocus
													className='pr-10'
												/>
												<Button
													type='button'
													variant='ghost'
													size='sm'
													className='absolute right-1 top-1/2 -translate-y-1/2'
													onClick={() => setShowPassword(!showPassword)}
												>
													{showPassword ? (
														<EyeOff className='w-4 h-4' />
													) : (
														<Eye className='w-4 h-4' />
													)}
												</Button>
											</div>
											<Button
												type='button'
												size='sm'
												className='bg-forest hover:bg-forest/80'
												onClick={() => handleUpdateProfile('password')}
											>
												Saqlash
											</Button>
										</div>
										{passwordError && (
											<p className='text-red-500 text-sm'>{passwordError}</p>
										)}
									</div>
								) : (
									<div className='flex items-center gap-2'>
										<span className='border p-2 rounded-md w-full'>
											********
										</span>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => startEditing('password')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									</div>
								)}
							</div>
						</div>

						<div className='flex flex-col gap-2 pt-4 border-t border-forest/20'>
							{user.role !== 'admin' && (
								<Button
									onClick={handleDeleteAccount}
									variant='destructive'
									className='w-full bg-red-500 hover:bg-red-600 text-white text-sm'
								>
									<Trash2 className='w-4 h-4 mr-2' /> Hisobni o‘chirish
								</Button>
							)}
							<Button
								onClick={handleLogout}
								variant='outline'
								className='w-full border-forest/20 text-forest hover:bg-sage/20 text-sm'
							>
								<LogOut className='w-4 h-4 mr-2' /> Chiqish
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

export default ProfileTab
