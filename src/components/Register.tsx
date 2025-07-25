import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { registerUser } from '@/services/auth'
import { RoleType } from '@/services/auth'

interface ErrorState {
	fullName: string
	email: string
	phone: string
	password: string
	otp: string
}

interface RegisterPayload {
	fullName: string
	email: string
	phone: string
	password: string
	businessName?: string
	experience?: string
	address?: string
}

interface RegisterProps {
	role: RoleType
	setTab: (value: 'register' | 'login') => void
	RoleSelector: () => JSX.Element
}

export default function Register({
	role,
	setTab,
	RoleSelector,
}: RegisterProps) {
	const navigate = useNavigate()
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('+998')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [businessName, setBusinessName] = useState('')
	const [address, setAddress] = useState('')
	const [experience, setExperience] = useState('')
	const [errors, setErrors] = useState<ErrorState>({
		fullName: '',
		email: '',
		phone: '',
		password: '',
		otp: '',
	})

	const validate = (): boolean => {
		const e: ErrorState = {
			fullName: !fullName ? 'Ism Familiya kerak' : '',
			email: !email
				? 'Email kerak'
				: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
				? 'Email noto`g`ri'
				: '',
			phone: !phone
				? 'Telefon kerak'
				: !/^\+998\d{9}$/.test(phone)
				? 'Telefon noto`g`ri'
				: '',
			password: !password
				? 'Parol kerak'
				: password.length < 8 ||
				  !/[A-Z]/.test(password) ||
				  !/[a-z]/.test(password) ||
				  !/[0-9]/.test(password) ||
				  !/[!@#$%^&*()_+=-]/.test(password)
				? 'Parol kamida 8ta belgidan, katta va kichik harf, raqam va belgidan iborat bo`lishi lozim'
				: '',
			otp: '',
		}
		setErrors(e)
		return Object.values(e).every(val => val === '')
	}

	const handleRegister = async (e: FormEvent) => {
		e.preventDefault()
		if (!validate()) return
		setLoading(true)
		try {
			const payload: RegisterPayload = { fullName, email, phone, password }
			if (role === 'seller') {
				payload.businessName = businessName
				payload.experience = experience
				payload.address = address
			}
			await registerUser(payload, role)
			toast.success('Ro`yxatdan o`tildi! Endi login qiling.', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
			setTab('login')
		} catch (err) {
			toast.error(
				err.response?.data?.error?.message || 'Royxatdan o`tishda xatolik',
				{ icon: <AlertCircle className='w-5 h-5 text-red-500' /> }
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleRegister} className='space-y-4'>
			<h2 className='text-xl font-bold text-forest'>Ro`yxatdan o`tish</h2>
			<RoleSelector />
			<div>
				<label className='text-sm font-medium text-forest'>Ism Familiya</label>
				<Input
					placeholder='Ism Familiya'
					value={fullName}
					onChange={e => setFullName(e.target.value)}
				/>
				{errors.fullName && (
					<p className='text-red-500 text-sm'>{errors.fullName}</p>
				)}
			</div>
			<div>
				<label className='text-sm font-medium text-forest'>Email</label>
				<Input
					placeholder='Email'
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				{errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
			</div>
			<div>
				<label className='text-sm font-medium text-forest'>Telefon</label>
				<Input
					placeholder='Telefon (+998...)'
					value={phone}
					onChange={e => setPhone(e.target.value)}
				/>
				{errors.phone && <p className='text-red-500 text-sm'>{errors.phone}</p>}
			</div>
			<div className='relative'>
				<label className='text-sm font-medium text-forest'>Parol</label>
				<Input
					type={showPassword ? 'text' : 'password'}
					placeholder='Parol'
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<button
					type='button'
					onClick={() => setShowPassword(prev => !prev)}
					className='absolute right-2 top-11 -translate-y-1/2'
				>
					{showPassword ? (
						<EyeOffIcon className='w-5 h-5 text-forest' />
					) : (
						<EyeIcon className='w-5 h-5 text-forest' />
					)}
				</button>
				{errors.password && (
					<p className='text-red-500 text-sm'>{errors.password}</p>
				)}
			</div>
			{role === 'seller' && (
				<div className='space-y-4 border-t pt-4 border-forest/20'>
					<div>
						<label className='text-sm font-medium text-forest'>
							Biznes nomi
						</label>
						<Input
							placeholder='Masalan: Nihol planting'
							value={businessName}
							onChange={e => setBusinessName(e.target.value)}
						/>
					</div>
					<div>
						<label className='text-sm font-medium text-forest'>Manzil</label>
						<Input
							placeholder='Manzil'
							value={address}
							onChange={e => setAddress(e.target.value)}
						/>
					</div>
					<div>
						<label className='text-sm font-medium text-forest'>Tajriba</label>
						<select
							value={experience}
							onChange={e => setExperience(e.target.value)}
							className='w-full border rounded p-2 border-forest/20 bg-white'
						>
							<option value=''>Tajriba tanlang</option>
							<option value='1'>1 yilgacha</option>
							<option value='1-3'>1-3 yil</option>
							<option value='3-5'>3-5 yil</option>
							<option value='5-10'>5-10 yil</option>
							<option value='10+'>10+ yil</option>
						</select>
					</div>
				</div>
			)}
			<Button
				type='submit'
				className='w-full bg-gradient-to-r from-forest to-moss text-white'
				disabled={loading}
			>
				{loading ? 'Yuborilmoqda...' : 'Ro`yxatdan o`tish'}
			</Button>
		</form>
	)
}
