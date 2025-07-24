import { useEffect, useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
	User,
	Store,
	EyeIcon,
	EyeOffIcon,
	ArrowLeft,
	CheckCircle,
	AlertCircle,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { loginUser, registerUser, requestOtp } from '@/services/auth'

type TabType = 'register' | 'login'
type RoleType = 'buyer' | 'seller'

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

export default function Auth() {
	const navigate = useNavigate()
	const [tab, setTab] = useState<TabType>('register')
	const [role, setRole] = useState<RoleType>('buyer')
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('+998')
	const [password, setPassword] = useState('')
	const [otp, setOtp] = useState(['', '', '', '', '', ''])
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [resendTimer, setResendTimer] = useState(0)
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

	useEffect(() => {
		let timer: NodeJS.Timeout
		if (resendTimer > 0) {
			timer = setInterval(() => setResendTimer(prev => prev - 1), 1000)
		}
		return () => clearInterval(timer)
	}, [resendTimer])

	const validate = (): boolean => {
		const e: ErrorState = {
			fullName: tab === 'register' && !fullName ? 'Ism Familiya kerak' : '',
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
				: tab === 'register' &&
				  (password.length < 8 ||
						!/[A-Z]/.test(password) ||
						!/[a-z]/.test(password) ||
						!/[0-9]/.test(password) ||
						!/[!@#$%^&*()_+=-]/.test(password))
				? 'Parol kamida 8ta belgidan, katta va kichik harf, raqam va belgidan iborat bo`lishi lozim'
				: '',
			otp:
				tab === 'login' && otp.join('').length !== 6
					? '6 raqamli OTP kod kerak'
					: '',
		}
		setErrors(e)
		return Object.values(e).every(val => val === '')
	}

	const handleOtpChange = (index: number, value: string) => {
		if (/^\d?$/.test(value)) {
			const newOtp = [...otp]
			newOtp[index] = value
			setOtp(newOtp)
			if (value && index < 5) {
				document.getElementById(`otp-${index + 1}`)?.focus()
			}
		}
	}

	const handleOtpKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			document.getElementById(`otp-${index - 1}`)?.focus()
		}
	}

	const RoleSelector = () => (
		<div className='flex gap-2'>
			{(['buyer', 'seller'] as RoleType[]).map(r => (
				<div
					key={r}
					onClick={() => setRole(r)}
					className={`flex-1 border p-2 rounded cursor-pointer flex items-center gap-2 ${
						role === r
							? 'bg-sage/50 border-forest border-2'
							: 'border-forest/20'
					}`}
				>
					{r === 'buyer' ? (
						<User className='w-5 h-5 text-forest' />
					) : (
						<Store className='w-5 h-5 text-forest' />
					)}
					<p className='text-sm font-medium text-forest'>
						{r === 'buyer' ? 'Xaridor' : 'Sotuvchi'}
					</p>
				</div>
			))}
		</div>
	)

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
			if (role === 'seller') {
				localStorage.setItem('businessName', businessName)
				localStorage.setItem('address', address)
				localStorage.setItem('experience', experience)
			}
			toast.success('Ro`yxatdan o`tildi! Endi login qiling.', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
			setTab('login')
		} catch (err) {
			toast.error(
				err.response?.data?.error?.message || 'Ro`yxatdan o`tishda xatolik',
				{
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				}
			)
		} finally {
			setLoading(false)
		}
	}

	const handleRequestOtp = async () => {
		if (!email) {
			toast.error('Email kerak', {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
			return
		}
		setLoading(true)
		try {
			await requestOtp({ email })
			toast.success('OTP yuborildi!', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
			setResendTimer(60)
		} catch (err) {
			// Agar xato "Foydalanuvchi topilmadi" bo`lsa, lekin OTP kelsa, muvaffaqiyat deb hisoblaymiz
			if (err.response?.data?.error?.message === 'Foydalanuvchi topilmadi') {
				toast.success('OTP yuborildi!', {
					icon: <CheckCircle className='w-5 h-5 text-forest' />,
				})
				setResendTimer(60)
			} else {
				toast.error(
					err.response?.data?.error?.message || 'OTP yuborishda xatolik',
					{
						icon: <AlertCircle className='w-5 h-5 text-red-500' />,
					}
				)
			}
		} finally {
			setLoading(false)
		}
	}

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault()
		if (!validate()) return
		setLoading(true)
		try {
			const data = await loginUser({ email, password, otp: otp.join('') }, role)
			localStorage.setItem('access_token', data.access_token)
			localStorage.setItem('userId', String(data.userId))
			localStorage.setItem('email', data.email)
			localStorage.setItem('role', role)
			toast.success('Tizimga muvaffaqiyatli kirdingiz!', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
			navigate('/profile')
		} catch (err) {
			toast.error(err.response?.data?.error?.message || 'Kirishda xatolik', {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-muted p-4'>
			<div className='w-full max-w-md space-y-4'>
				<Link to='/' className='inline-flex items-center text-forest mb-4'>
					<ArrowLeft className='mr-2 w-4 h-4' />
					Bosh sahifaga qaytish
				</Link>
				<Tabs value={tab} onValueChange={v => setTab(v as TabType)}>
					<TabsList className='grid grid-cols-2 bg-sage/20'>
						<TabsTrigger value='register' className='text-forest'>
							Ro`yxatdan o`tish
						</TabsTrigger>
						<TabsTrigger value='login' className='text-forest'>
							Kirish
						</TabsTrigger>
					</TabsList>
					<TabsContent value='register'>
						<form onSubmit={handleRegister} className='space-y-4'>
							<h2 className='text-xl font-bold text-forest'>
								Ro`yxatdan o`tish
							</h2>
							<RoleSelector />
							<div>
								<label className='text-sm font-medium text-forest'>
									Ism Familiya
								</label>
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
								{errors.email && (
									<p className='text-red-500 text-sm'>{errors.email}</p>
								)}
							</div>
							<div>
								<label className='text-sm font-medium text-forest'>
									Telefon
								</label>
								<Input
									placeholder='Telefon (+998...)'
									value={phone}
									onChange={e => setPhone(e.target.value)}
								/>
								{errors.phone && (
									<p className='text-red-500 text-sm'>{errors.phone}</p>
								)}
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
										<label className='text-sm font-medium text-forest'>
											Manzil
										</label>
										<Input
											placeholder='Manzil'
											value={address}
											onChange={e => setAddress(e.target.value)}
										/>
									</div>
									<div>
										<label className='text-sm font-medium text-forest'>
											Tajriba
										</label>
										<select
											value={experience}
											onChange={e => setExperience(e.target.value)}
											className='w-full border rounded p-2 border-forest/20 bg-white'
										>
											<option value=''>Tajriba tanlang</option>
											<option value='1'>1 yilgacha</option>
											<option value='1-3'>1–3 yil</option>
											<option value='3-5'>3–5 yil</option>
											<option value='5-10'>5–10 yil</option>
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
					</TabsContent>
					<TabsContent value='login'>
						<form onSubmit={handleLogin} className='space-y-4'>
							<h2 className='text-xl font-bold text-forest'>Kirish</h2>
							<RoleSelector />
							<div>
								<label className='text-sm font-medium text-forest'>Email</label>
								<Input
									placeholder='Email'
									value={email}
									onChange={e => setEmail(e.target.value)}
								/>
								{errors.email && (
									<p className='text-red-500 text-sm'>{errors.email}</p>
								)}
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
							<div>
								<label className='text-sm font-medium text-forest'>
									OTP kod
								</label>
								<div className='flex gap-2'>
									{otp.map((digit, index) => (
										<Input
											key={index}
											id={`otp-${index}`}
											type='text'
											maxLength={1}
											value={digit}
											onChange={e => handleOtpChange(index, e.target.value)}
											onKeyDown={e => handleOtpKeyDown(index, e)}
											className='w-10 h-10 text-center text-lg border-forest/20'
										/>
									))}
								</div>
								{errors.otp && (
									<p className='text-red-500 text-sm'>{errors.otp}</p>
								)}
							</div>
							<div className='flex justify-between items-center'>
								<Button
									type='button'
									onClick={handleRequestOtp}
									className='bg-sage/20 text-forest border border-forest/20 hover:bg-sage/50'
									disabled={loading || resendTimer > 0}
								>
									{loading
										? 'Yuborilmoqda...'
										: resendTimer > 0
										? `Qayta yuborish (${resendTimer}s)`
										: 'OTP yuborish'}
								</Button>
								{resendTimer > 0 && (
									<p className='text-sm text-forest'>
										Qayta yuborish {resendTimer} soniyadan keyin
									</p>
								)}
							</div>
							<Button
								type='submit'
								className='w-full bg-gradient-to-r from-forest to-moss text-white'
								disabled={loading}
							>
								{loading ? 'Kirish...' : 'Kirish'}
							</Button>
						</form>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
