import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EyeIcon, EyeOffIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { api } from '@/lib/api'

export default function AdminLogin() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!email || !password) {
			toast.error('Email va parol kerak', {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
			return
		}
		setLoading(true)
		try {
			const res = await api.post('/auth/admin/login', { email, password })
			const { access_token, userId, email: userEmail, role } = res.data
			if (role !== 'admin') {
				toast.error('Faqat admin foydalanuvchilar kirishi mumkin', {
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				})
				return
			}
			localStorage.setItem('access_token', access_token)
			localStorage.setItem('userId', userId)
			localStorage.setItem('email', userEmail)
			localStorage.setItem('role', role)
			toast.success('Admin panelga muvaffaqiyatli kirdingiz', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
			navigate('/admin/dashboard')
		} catch (err) {
			toast.error(err.response?.data?.error?.message || 'Kirishda xatolik', {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen flex justify-center items-center bg-muted p-4 sm:p-6'>
			<Card className='w-full max-w-md border-forest/20'>
				<CardHeader>
					<CardTitle className='text-xl font-bold text-forest'>
						Admin Panelga Kirish
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleLogin} className='space-y-4'>
						<div>
							<label className='text-sm font-medium text-forest'>Email</label>
							<Input
								placeholder='Email'
								type='email'
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
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
						</div>
						<Button
							type='submit'
							className='w-full bg-gradient-to-r from-forest to-moss text-white'
							disabled={loading}
						>
							{loading ? 'Yuklanmoqda...' : 'Kirish'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
