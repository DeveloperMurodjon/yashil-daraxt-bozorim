import { useState } from 'react'
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
import {
	AlertCircle,
	CheckCircle,
	LogOut,
	Trash2,
	Eye,
	EyeOff,
	Pencil,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { deleteSellerAccount } from '@/services/productService'
import { UserProfile, UpdateSellerProfilePayload } from '@/types/types'
import { updateSellerProfile } from '@/services/auth'

interface ProfileTabProps {
	user: UserProfile
	setUser: (user: UserProfile) => void
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user, setUser }) => {
	const [editableFields, setEditableFields] = useState({
		fullName: false,
		phone: false,
		email: false,
		password: false,
		businessName: false,
		addres: false,
		experience: false,
	})
	const [showPassword, setShowPassword] = useState(false)

	const viloyatlar = [
		'Andijon',
		'Buxoro',
		'Farg`ona',
		'Jizzax',
		'Xorazm',
		'Namangan',
		'Navoiy',
		'Qashqadaryo',
		'Samarqand',
		'Sirdaryo',
		'Surxondaryo',
		'Toshkent viloyati',
		'Toshkent shahri',
	]

	const tajribaOptions = ['1', '3-5', '10']

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		if (name === 'phone') {
			const digits = value.replace(/^\+998/, '').replace(/\D/g, '')
			setUser({ ...user, phone: `+998${digits}` })
		} else if (
			name === 'businessName' ||
			name === 'addres' ||
			name === 'experience'
		) {
			setUser({
				...user,
				sellerInfo: { ...user.sellerInfo!, [name]: value },
			})
		} else {
			setUser({ ...user, [name]: value })
		}
	}

	const toggleEditField = (field: keyof typeof editableFields) => {
		setEditableFields({ ...editableFields, [field]: !editableFields[field] })
	}

	const handleFieldSave = async (field: keyof typeof editableFields) => {
		try {
			if (!user.id) {
				toast.error('Foydalanuvchi ID topilmadi', {
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				})
				return
			}

			const data: UpdateSellerProfilePayload = {}
			if (field === 'fullName') data.fullName = user.fullName
			if (field === 'phone') data.phone = user.phone
			if (field === 'email') data.email = user.email
			if (field === 'password') data.password = user.password
			if (field === 'businessName')
				data.businessName = user.sellerInfo?.businessName
			if (field === 'addres') data.addres = user.sellerInfo?.addres
			if (field === 'experience') data.experience = user.sellerInfo?.experience

			const updatedProfile = await updateSellerProfile(user.id, data)
			setUser(updatedProfile)
			setEditableFields({ ...editableFields, [field]: false })
			toast.success(`${field} muvaffaqiyatli yangilandi`, {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
		} catch (error) {
			toast.error(`${field} yangilashda xatolik`, {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
		}
	}

	const handleDeleteAccount = async () => {
		if (!confirm('Haqiqatan hisobingizni o`chirishni xohlaysizmi?')) return
		try {
			await deleteSellerAccount(user.id)
			localStorage.clear()
			toast.success('Hisob muvaffaqiyatli o`chirildi', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
			window.location.href = '/auth'
		} catch (error) {
			toast.error('Hisobni o`chirishda xatolik', {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
		}
	}

	const handleLogout = () => {
		localStorage.clear()
		window.location.href = '/auth'
	}

	return (
		<div className='space-y-2'>
			<h2 className='text-2xl font-bold text-forest'>Profil</h2>
			<Card className='shadow-card'>
				<CardHeader>
					<CardTitle className='text-forest'>Shaxsiy Ma'lumotlar</CardTitle>
					<CardDescription>
						O'zingiz haqingizda ma'lumotlarni yangilang
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2 flex items-end'>
							<div className='flex-1'>
								<Label htmlFor='profile-fullName'>Ism-Familiya</Label>
								{editableFields.fullName ? (
									<Input
										id='profile-fullName'
										name='fullName'
										value={user.fullName || ''}
										onChange={handleInputChange}
									/>
								) : (
									<Input
										id='profile-fullName'
										name='fullName'
										value={user.fullName || ''}
										readOnly
										className='bg-gray-100'
									/>
								)}
							</div>
							<div className='flex space-x-2 ml-2'>
								{editableFields.fullName ? (
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => handleFieldSave('fullName')}
									>
										Saqlash
									</Button>
								) : (
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => toggleEditField('fullName')}
									>
										<Pencil className='w-4 h-4' />
									</Button>
								)}
							</div>
						</div>
						<div className='space-y-2 flex items-end'>
							<div className='flex-1'>
								<Label htmlFor='profile-email'>Email</Label>
								{editableFields.email ? (
									<Input
										id='profile-email'
										name='email'
										type='email'
										value={user.email || ''}
										onChange={handleInputChange}
									/>
								) : (
									<Input
										id='profile-email'
										name='email'
										value={user.email || ''}
										readOnly
										className='bg-gray-100'
									/>
								)}
							</div>
							<div className='flex space-x-2 ml-2'>
								{editableFields.email ? (
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => handleFieldSave('email')}
									>
										Saqlash
									</Button>
								) : (
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => toggleEditField('email')}
									>
										<Pencil className='w-4 h-4' />
									</Button>
								)}
							</div>
						</div>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2 flex items-end'>
							<div className='flex-1'>
								<Label htmlFor='profile-phone'>Telefon</Label>
								{editableFields.phone ? (
									<Input
										id='profile-phone'
										name='phone'
										value={user.phone || '+998'}
										onChange={handleInputChange}
										placeholder='+998'
									/>
								) : (
									<Input
										id='profile-phone'
										name='phone'
										value={user.phone || '+998'}
										readOnly
										className='bg-gray-100'
									/>
								)}
							</div>
							<div className='flex space-x-2 ml-2'>
								{editableFields.phone ? (
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => handleFieldSave('phone')}
									>
										Saqlash
									</Button>
								) : (
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => toggleEditField('phone')}
									>
										<Pencil className='w-4 h-4' />
									</Button>
								)}
							</div>
						</div>
						<div className='space-y-2 flex items-end'>
							<div className='flex-1'>
								<Label htmlFor='profile-password'>Parol</Label>
								{editableFields.password ? (
									<div className='relative'>
										<Input
											id='profile-password'
											name='password'
											type={showPassword ? 'text' : 'password'}
											value={user.password || ''}
											onChange={e =>
												setUser({ ...user, password: e.target.value })
											}
										/>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => setShowPassword(!showPassword)}
											className='absolute right-2 top-1/2 transform -translate-y-1/2'
										>
											{showPassword ? (
												<EyeOff className='w-4 h-4' />
											) : (
												<Eye className='w-4 h-4' />
											)}
										</Button>
									</div>
								) : (
									<Input
										id='profile-password'
										name='password'
										type='password'
										value={user.password || ''}
										readOnly
										className='bg-gray-100'
									/>
								)}
							</div>
							<div className='flex space-x-2 ml-2'>
								{editableFields.password ? (
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => handleFieldSave('password')}
									>
										Saqlash
									</Button>
								) : (
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => toggleEditField('password')}
									>
										<Pencil className='w-4 h-4' />
									</Button>
								)}
							</div>
						</div>
					</div>
					{user.role === 'seller' && user.sellerInfo && (
						<div className='space-y-4 border-t pt-4 border-forest/20'>
							<div className='space-y-2 flex items-end'>
								<div className='flex-1'>
									<Label htmlFor='profile-businessName'>Biznes nomi</Label>
									{editableFields.businessName ? (
										<Input
											id='profile-businessName'
											name='businessName'
											value={user.sellerInfo.businessName || ''}
											onChange={handleInputChange}
										/>
									) : (
										<Input
											id='profile-businessName'
											name='businessName'
											value={user.sellerInfo.businessName || ''}
											readOnly
											className='bg-gray-100'
										/>
									)}
								</div>
								<div className='flex space-x-2 ml-2'>
									{editableFields.businessName ? (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => handleFieldSave('businessName')}
										>
											Saqlash
										</Button>
									) : (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => toggleEditField('businessName')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									)}
								</div>
							</div>
							<div className='space-y-2 flex items-end'>
								<div className='flex-1'>
									<Label htmlFor='profile-addres'>Manzil</Label>
									{editableFields.addres ? (
										<select
											id='profile-addres'
											name='addres'
											value={user.sellerInfo.addres || ''}
											onChange={handleInputChange}
											className='w-full p-2 border border-border rounded-md bg-background text-forest focus:outline-none focus:ring-2 focus:ring-forest/50'
										>
											{viloyatlar.map(viloyat => (
												<option key={viloyat} value={viloyat}>
													{viloyat}
												</option>
											))}
										</select>
									) : (
										<Input
											id='profile-addres'
											name='addres'
											value={user.sellerInfo.addres || ''}
											readOnly
											className='bg-gray-100'
										/>
									)}
								</div>
								<div className='flex space-x-2 ml-2'>
									{editableFields.addres ? (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => handleFieldSave('addres')}
										>
											Saqlash
										</Button>
									) : (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => toggleEditField('addres')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									)}
								</div>
							</div>
							<div className='space-y-2 flex items-end'>
								<div className='flex-1'>
									<Label htmlFor='profile-experience'>Tajriba (yil)</Label>
									{editableFields.experience ? (
										<select
											id='profile-experience'
											name='experience'
											value={user.sellerInfo.experience || ''}
											onChange={handleInputChange}
											className='w-full p-2 border border-border rounded-md bg-background text-forest focus:outline-none focus:ring-2 focus:ring-forest/50'
										>
											<option value='' disabled>
												Tanlang
											</option>
											{tajribaOptions.map(option => (
												<option key={option} value={option}>
													{option}
												</option>
											))}
										</select>
									) : (
										<Input
											id='profile-experience'
											name='experience'
											value={user.sellerInfo.experience || ''}
											readOnly
											className='bg-gray-100'
										/>
									)}
								</div>
								<div className='flex space-x-2 ml-2'>
									{editableFields.experience ? (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => handleFieldSave('experience')}
										>
											Saqlash
										</Button>
									) : (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => toggleEditField('experience')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									)}
								</div>
							</div>
						</div>
					)}
					<div className='flex flex-col gap-2 pt-4 border-t border-forest/20'>
						{user.role !== 'admin' && (
							<Button
								onClick={handleDeleteAccount}
								variant='destructive'
								className='w-full bg-red-500 hover:bg-red-600 text-white text-sm'
							>
								<Trash2 className='w-4 h-4 mr-2' /> Hisobni o`chirish
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
		</div>
	)
}

export default ProfileTab
