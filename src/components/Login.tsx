import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import {
	loginUser,
	requestForgotPasswordOtp,
	resetPassword,
} from '@/services/auth'
import { RoleType } from '@/services/auth'

interface ErrorState {
	fullName: string
	email: string
	phone: string
	password: string
	confirmPassword?: string
	otp?: string
}

interface LoginProps {
	role: RoleType
	RoleSelector: () => JSX.Element
}

export default function Login({ role, RoleSelector }: LoginProps) {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [resendTimer, setResendTimer] = useState(0)
	const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
		useState(false)
	const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
		useState(false)
	const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
	const [otp, setOtp] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [errors, setErrors] = useState<ErrorState>({
		fullName: '',
		email: '',
		phone: '',
		password: '',
		confirmPassword: '',
		otp: '',
	})

	useEffect(() => {
		let timer: NodeJS.Timeout
		if (resendTimer > 0)
			timer = setInterval(() => setResendTimer(prev => prev - 1), 1000)
		return () => clearInterval(timer)
	}, [resendTimer])

	const validateLogin = (): boolean => {
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
		}
		setErrors(e)
		return Object.values(e).every(val => val === '')
	}

	const validateForgotPasswordEmail = (): boolean => {
		const e: ErrorState = {
			fullName: '',
			email: !forgotPasswordEmail
				? 'Email kerak'
				: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail)
				? 'Email noto`g`ri formatda'
				: '',
			phone: '',
			password: '',
		}
		setErrors(e)
		return Object.values(e).every(val => val === '')
	}

	const validateResetPassword = (): boolean => {
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
		const e: ErrorState = {
			fullName: '',
			email: '',
			phone: '',
			password: !newPassword
				? 'Yangi parol kerak'
				: !passwordRegex.test(newPassword)
				? 'Parol kamida 8 belgi, 1 katta harf, 1 kichik harf, 1 raqam va 1 maxsus belgi bo`lishi kerak'
				: '',
			confirmPassword:
				newPassword !== confirmPassword ? 'Parollar mos kelmaydi' : '',
			otp: !otp
				? 'OTP kod kerak'
				: otp.length !== 6
				? 'OTP kod 6 ta raqam bo`lishi kerak'
				: '',
		}
		setErrors(e)
		return Object.values(e).every(val => val === '')
	}

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault()
		if (!validateLogin()) return
		setLoading(true)
		try {
			localStorage.clear()
			const data = await loginUser({ email, password }, role)
			localStorage.setItem('access_token', data.access_token || data.token)
			localStorage.setItem('userId', String(data.userId || data.id || ''))
			localStorage.setItem('email', data.email || '')
			localStorage.setItem('role', role)
			toast.success('Tizimga muvaffaqiyatli kirdingiz!', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})

			navigate(
				role == 'seller'
					? '/seller-dashboard?tab=profile'
					: role == 'user'
					? '/user-dashboard?tab=profile'
					: '/'
			)
		} catch (err) {
			toast.error(
				err.response?.data?.error?.message || 'Login qilishda xatolik',
				{ icon: <AlertCircle className='w-5 h-5 text-red-500' /> }
			)
		} finally {
			setLoading(false)
		}
	}

	const handleRequestForgotPasswordOtp = async (e: FormEvent) => {
		e.preventDefault()
		if (!validateForgotPasswordEmail()) return
		setLoading(true)
		try {
			await requestForgotPasswordOtp({ email: forgotPasswordEmail }, role)
			toast.success('OTP kod emailga yuborildi!', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
			setResendTimer(60)
			setIsForgotPasswordModalOpen(false)
			setIsResetPasswordModalOpen(true)
		} catch (err) {
			toast.error(
				err.response?.data?.error?.message || 'OTP yuborishda xatolik',
				{ icon: <AlertCircle className='w-5 h-5 text-red-500' /> }
			)
		} finally {
			setLoading(false)
		}
	}

	const handleResetPassword = async (e: FormEvent) => {
		e.preventDefault()
		if (!validateResetPassword()) return
		setLoading(true)
		try {
			await resetPassword(
				{ email: forgotPasswordEmail, password: newPassword, otp },
				role
			)
			toast.success('Parol muvaffaqiyatli yangilandi!', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
			setIsResetPasswordModalOpen(false)
			setForgotPasswordEmail('')
			setOtp('')
			setNewPassword('')
			setConfirmPassword('')
		} catch (err) {
			toast.error(
				err.response?.data?.error?.message || 'Parolni yangilashda xatolik',
				{ icon: <AlertCircle className='w-5 h-5 text-red-500' /> }
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='relative'>
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
				<div className='text-right'>
					<button
						type='button'
						onClick={() => setIsForgotPasswordModalOpen(true)}
						className='text-sm text-forest hover:underline'
					>
						Parolni unutdingizmi?
					</button>
				</div>
				<Button
					type='submit'
					className='w-full bg-gradient-to-r from-forest to-moss text-white'
					disabled={loading}
				>
					{loading ? 'Kirish...' : 'Kirish'}
				</Button>
			</form>

			{isForgotPasswordModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-bold text-forest mb-4'>
							Parolni tiklash
						</h3>
						<form
							onSubmit={handleRequestForgotPasswordOtp}
							className='space-y-4'
						>
							<div>
								<label className='text-sm font-medium text-forest'>Email</label>
								<Input
									placeholder='Email'
									value={forgotPasswordEmail}
									onChange={e => setForgotPasswordEmail(e.target.value)}
									className='mt-1'
								/>
								{errors.email && (
									<p className='text-red-500 text-sm mt-1'>{errors.email}</p>
								)}
							</div>
							<div className='flex justify-end gap-2'>
								<Button
									type='button'
									onClick={() => setIsForgotPasswordModalOpen(false)}
									className='bg-gray-200 text-forest'
								>
									Bekor qilish
								</Button>
								<Button
									type='submit'
									className='bg-gradient-to-r from-forest to-moss text-white'
									disabled={loading}
								>
									{loading ? 'Yuborilmoqda...' : 'OTP yuborish'}
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}

			{isResetPasswordModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-bold text-forest mb-4'>
							Yangi parol o'rnatish
						</h3>
						<form onSubmit={handleResetPassword} className='space-y-4'>
							<div>
								<label className='text-sm font-medium text-forest'>
									Emailga kelgan kodni kiriting{' '}
								</label>
								<Input
									placeholder='Emailga kelgan kod'
									value={otp}
									onChange={e => setOtp(e.target.value)}
									className='mt-1'
								/>
								{errors.otp && (
									<p className='text-red-500 text-sm mt-1'>{errors.otp}</p>
								)}
							</div>
							<div className='relative'>
								<label className='text-sm font-medium text-forest'>
									Yangi parol
								</label>
								<Input
									type={showNewPassword ? 'text' : 'password'}
									placeholder='Yangi parol'
									value={newPassword}
									onChange={e => setNewPassword(e.target.value)}
									className='mt-1'
								/>
								<button
									type='button'
									onClick={() => setShowNewPassword(prev => !prev)}
									className='absolute right-2 top-[42px] -translate-y-1/2'
								>
									{showNewPassword ? (
										<EyeOffIcon className='w-5 h-5 text-forest' />
									) : (
										<EyeIcon className='w-5 h-5 text-forest' />
									)}
								</button>
								{errors.password && (
									<p className='text-red-500 text-sm mt-1'>{errors.password}</p>
								)}
							</div>
							<div className='relative'>
								<label className='text-sm font-medium text-forest'>
									Parolni tasdiqlash
								</label>
								<Input
									type={showConfirmPassword ? 'text' : 'password'}
									placeholder='Parolni tasdiqlash'
									value={confirmPassword}
									onChange={e => setConfirmPassword(e.target.value)}
									className='mt-1'
								/>
								<button
									type='button'
									onClick={() => setShowConfirmPassword(prev => !prev)}
									className='absolute right-2 top-[42px] -translate-y-1/2'
								>
									{showConfirmPassword ? (
										<EyeOffIcon className='w-5 h-5 text-forest' />
									) : (
										<EyeIcon className='w-5 h-5 text-forest' />
									)}
								</button>
								{errors.confirmPassword && (
									<p className='text-red-500 text-sm mt-1'>
										{errors.confirmPassword}
									</p>
								)}
							</div>
							<div className='flex justify-between items-center'>
								<Button
									type='button'
									onClick={handleRequestForgotPasswordOtp}
									className='bg-sage/20 text-forest border border-forest/20 hover:bg-sage/50'
									disabled={loading || resendTimer > 0}
								>
									{loading
										? 'Yuborilmoqda...'
										: resendTimer > 0
										? `Qayta yuborish (${resendTimer}s)`
										: 'OTP qayta yuborish'}
								</Button>
								{resendTimer > 0 && (
									<p className='text-sm text-forest'>
										Qayta yuborish {resendTimer} soniyadan keyin
									</p>
								)}
							</div>
							<div className='flex justify-end gap-2'>
								<Button
									type='button'
									onClick={() => setIsResetPasswordModalOpen(false)}
									className='bg-gray-200 text-forest'
								>
									Bekor qilish
								</Button>
								<Button
									type='submit'
									className='bg-gradient-to-r from-forest to-moss text-white'
									disabled={loading}
								>
									{loading ? 'Yangilash...' : 'Parolni o`zgartirish'}
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}
