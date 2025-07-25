import { useState, FormEvent } from 'react'
import { createUser } from '@/services/admin'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

interface ErrorState {
	fullName: string
	email: string
	phone: string
	password: string
}

export default function CreateUser() {
	const [loading, setLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('+998')
	const [password, setPassword] = useState('')
	const [errors, setErrors] = useState<ErrorState>({
		fullName: '',
		email: '',
		phone: '',
		password: '',
	})

	const validate = (): boolean => {
		const e: ErrorState = {
			fullName: fullName ? '' : 'Ism Familiya kerak',
			email: !email
				? 'Email kerak'
				: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
				? ''
				: 'Email noto`g`ri',
			phone: !phone
				? 'Telefon kerak'
				: /^\+998\d{9}$/.test(phone)
				? ''
				: 'Telefon noto`g`ri',
			password: !password
				? 'Parol kerak'
				: password.length >= 8 &&
				  /[A-Z]/.test(password) &&
				  /[a-z]/.test(password) &&
				  /[0-9]/.test(password) &&
				  /[!@#$%^&*()_+=-]/.test(password)
				? ''
				: 'Parol kamida 8ta belgidan, katta va kichik harf, raqam va belgidan iborat bo`lishi lozim',
		}
		setErrors(e)
		return Object.values(e).every(val => val === '')
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		if (!validate()) return
		setLoading(true)
		try {
			await createUser({ fullName, email, phone, password })
			toast.success('Xaridor muvaffaqiyatli yaratildi', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
			setFullName('')
			setEmail('')
			setPhone('+998')
			setPassword('')
		} catch (err) {
			toast.error(err.response?.data?.error?.message || 'Yaratishda xatolik', {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-muted p-4 sm:p-6'>
			<div className='w-full max-w-md space-y-4 sm:max-w-lg'>
				<h1 className='text-lg sm:text-xl font-bold text-forest'>
					Foydalanuvchi qo`shish
				</h1>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className='text-sm font-medium text-forest'>
							Ism Familiya
						</label>
						<Input
							placeholder='Ism Familiya'
							value={fullName}
							onChange={e => setFullName(e.target.value)}
							className='text-sm'
						/>
						{errors.fullName && (
							<p className='text-red-500 text-xs sm:text-sm'>
								{errors.fullName}
							</p>
						)}
					</div>
					<div>
						<label className='text-sm font-medium text-forest'>Email</label>
						<Input
							placeholder='Email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							className='text-sm'
						/>
						{errors.email && (
							<p className='text-red-500 text-xs sm:text-sm'>{errors.email}</p>
						)}
					</div>
					<div>
						<label className='text-sm font-medium text-forest'>Telefon</label>
						<Input
							placeholder='Telefon (+998...)'
							value={phone}
							onChange={e => setPhone(e.target.value)}
							className='text-sm'
						/>
						{errors.phone && (
							<p className='text-red-500 text-xs sm:text-sm'>{errors.phone}</p>
						)}
					</div>
					<div className='relative'>
						<label className='text-sm font-medium text-forest'>Parol</label>
						<Input
							type={showPassword ? 'text' : 'password'}
							placeholder='Parol'
							value={password}
							onChange={e => setPassword(e.target.value)}
							className='text-sm'
						/>
						<button
							type='button'
							onClick={() => setShowPassword(prev => !prev)}
							className='absolute right-2 top-10 sm:top-11 -translate-y-1/2'
						>
							{showPassword ? (
								<EyeOffIcon className='w-4 sm:w-5 h-4 sm:h-5 text-forest' />
							) : (
								<EyeIcon className='w-4 sm:w-5 h-4 sm:h-5 text-forest' />
							)}
						</button>
						{errors.password && (
							<p className='text-red-500 text-xs sm:text-sm'>
								{errors.password}
							</p>
						)}
					</div>
					<Button
						type='submit'
						className='w-full bg-gradient-to-r from-forest to-moss text-white text-sm sm:text-base'
						disabled={loading}
					>
						{loading ? 'Yuborilmoqda...' : 'Qo`shish'}
					</Button>
				</form>
			</div>
		</div>
	)
}
