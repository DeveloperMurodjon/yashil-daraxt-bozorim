import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { loginUser, requestOtp } from '@/services/auth'
import { RoleType } from '@/services/auth'

interface ErrorState {
	fullName: string
	email: string
	phone: string
	password: string
	otp: string
}

interface LoginProps {
	role: RoleType
	RoleSelector: () => JSX.Element
}

export default function Login({ role, RoleSelector }: LoginProps) {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [otp, setOtp] = useState(['', '', '', '', '', ''])
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [resendTimer, setResendTimer] = useState(0)
	const [errors, setErrors] = useState<ErrorState>({
		fullName: '',
		email: '',
		phone: '',
		password: '',
		otp: '',
	})

	useEffect(() => {
		let timer: NodeJS.Timeout
		if (resendTimer > 0)
			timer = setInterval(() => setResendTimer(prev => prev - 1), 1000)
		return () => clearInterval(timer)
	}, [resendTimer])

	const validate = (): boolean => {
		const e: ErrorState = {
			fullName: '',
			email: !email
				? 'Email kerak'
				: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
				? 'Email noto`g`ri formatda'
				: '',
			phone: '',
			password: !password
				? 'Parol kerak'
				: password.length < 6
				? 'Parol 6 ta belgidan ko`p bo`lishi kerak'
				: '',
			otp: otp.join('').length !== 6 ? '6 raqamli OTP kod kerak' : '',
		}
		setErrors(e)
		return Object.values(e).every(val => val === '')
	}

	const handleOtpChange = (index: number, value: string) => {
		if (/^\d?$/.test(value)) {
			const newOtp = [...otp]
			newOtp[index] = value
			setOtp(newOtp)
			if (value && index < 5)
				document.getElementById(`otp-${index + 1}`)?.focus()
			else if (!value && index > 0)
				document.getElementById(`otp-${index - 1}`)?.focus()
		}
	}

	const handleOtpKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			e.preventDefault()
			document.getElementById(`otp-${index - 1}`)?.focus()
		}
	}

	const handleRequestOtp = async () => {
		if (!email) {
			toast.error('Email kiriting', {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
			return
		}
		setLoading(true)
		try {
			await requestOtp({ email }, role)
			toast.success('OTP kod muvaffaqiyatli yuborildi!', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
			setResendTimer(60)
		} catch (err) {
			const errorMsg =
				err.response?.data?.error?.message || 'OTP yuborishda xatolik'
			if (errorMsg === 'Foydalanuvchi topilmadi') {
				toast.success('OTP kod yuborildi, hisobni tekshiring!', {
					icon: <CheckCircle className='w-5 h-5 text-forest' />,
				})
				setResendTimer(60)
			} else {
				toast.error(errorMsg, {
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				})
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
			localStorage.clear()
			const data = await loginUser({ email, password, otp: otp.join('') }, role)
			localStorage.setItem('access_token', data.access_token || data.token)
			localStorage.setItem('userId', String(data.userId || data.id || ''))
			localStorage.setItem('email', data.email || '')
			localStorage.setItem('role', role)
			toast.success('Tizimga muvaffaqiyatli kirdingiz!', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
			navigate('/profile')
		} catch (err) {
			toast.error(
				err.response?.data?.error?.message || 'Login qilishda xatolik',
				{ icon: <AlertCircle className='w-5 h-5 text-red-500' /> }
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleLogin} className='space-y-6'>
			<h2 className='text-xl font-bold text-forest'>Kirish</h2>
			<RoleSelector />
			<div>
				<label className='text-sm font-medium text-forest'>Email</label>
				<Input
					placeholder='Email'
					value={email}
					onChange={e => setEmail(e.target.value)}
					className='mt-1'
				/>
				{errors.email && (
					<p className='text-red-500 text-sm mt-1'>{errors.email}</p>
				)}
			</div>
			<div className='relative'>
				<label className='text-sm font-medium text-forest'>Parol</label>
				<Input
					type={showPassword ? 'text' : 'password'}
					placeholder='Parol'
					value={password}
					onChange={e => setPassword(e.target.value)}
					className='mt-1'
				/>
				<button
					type='button'
					onClick={() => setShowPassword(prev => !prev)}
					className='absolute right-2 top-[42px] -translate-y-1/2'
				>
					{showPassword ? (
						<EyeOffIcon className='w-5 h-5 text-forest' />
					) : (
						<EyeIcon className='w-5 h-5 text-forest' />
					)}
				</button>
				{errors.password && (
					<p className='text-red-500 text-sm mt-1'>{errors.password}</p>
				)}
			</div>
			<div>
				<label className='text-sm font-medium text-forest'>OTP kod</label>
				<div className='flex gap-2 mt-1'>
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
					<p className='text-red-500 text-sm mt-1'>{errors.otp}</p>
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
	)
}
