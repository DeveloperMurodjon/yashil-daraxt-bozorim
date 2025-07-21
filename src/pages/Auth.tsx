'use client'

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Store, EyeIcon, EyeOffIcon, ArrowLeft } from 'lucide-react'
import { registerUser, requestOtp, loginUser } from '@/services/auth'

export default function Auth() {
	const navigate = useNavigate()

	const [activeTab, setActiveTab] = useState<'register' | 'login'>('register')
	const [type, setType] = useState<'buyer' | 'seller'>('buyer')

	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('+998')
	const [password, setPassword] = useState('')
	const [otp, setOtp] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)

	// Seller-only fields to store in localStorage
	const [businessName, setBusinessName] = useState('')
	const [address, setAddress] = useState('')
	const [region, setRegion] = useState('')
	const [experience, setExperience] = useState('')

	const [errors, setErrors] = useState({
		fullName: '',
		email: '',
		phone: '',
		password: '',
		otp: '',
	})

	const validate = () => {
		const newErrors = { ...errors }

		if (activeTab === 'register') {
			newErrors.fullName = fullName.trim().length < 5 ? 'Kamida 5 ta belgi' : ''
			newErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
				? ''
				: 'Email noto`g`ri'
			newErrors.phone = /^\+998\d{9}$/.test(phone) ? '' : 'Raqam noto`g`ri'
			newErrors.password =
				password.length < 8 ||
				!/[A-Z]/.test(password) ||
				!/[a-z]/.test(password) ||
				!/[0-9]/.test(password) ||
				!/[!@#$%^&*()_+=\-]/.test(password)
					? '8+ belgi, katta-kichik harf, raqam, belgi bo`lishi kerak'
					: ''
		} else {
			newErrors.email = email ? '' : 'Email kerak'
			newErrors.password = password ? '' : 'Parol kerak'
			newErrors.otp = otp ? '' : 'OTP kerak'
		}

		setErrors(newErrors)
		return Object.values(newErrors).every(e => e === '')
	}

	useEffect(() => {
		validate()
		// eslint-disable-next-line
	}, [fullName, email, phone, password, otp, activeTab])

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validate()) return
		setLoading(true)

		try {
			const payload = { fullName, email, phone, password }
			await registerUser(payload, type)

			if (type === 'seller') {
				localStorage.setItem('businessName', businessName)
				localStorage.setItem('address', address)
				localStorage.setItem('region', region)
				localStorage.setItem('experience', experience)
			}

			alert('Ro`yxatdan o`tish muvaffaqiyatli!')
			setActiveTab('login')
		} catch (err: any) {
			alert(err.response?.data?.error?.message || err.message)
		} finally {
			setLoading(false)
		}
	}

	const handleRequestOtp = async () => {
		if (!email) return alert('Emailni kiriting')
		setLoading(true)

		try {
			await requestOtp({ email })
			alert('OTP kod yuborildi!')
		} catch (err: any) {
			alert(err.response?.data?.error?.message || err.message)
		} finally {
			setLoading(false)
		}
	}

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validate()) return
		setLoading(true)

		try {
			const data = await loginUser({ email, password, otp }, type)
			localStorage.setItem('access_token', data.access_token)
			localStorage.setItem('userId', data.userId)
			localStorage.setItem('email', email)
			localStorage.setItem('role', type)
			navigate('/profile')
		} catch (err: any) {
			alert(err.response?.data?.error?.message || err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-muted p-4'>
			<div className='w-full max-w-md space-y-4'>
				<div className='mb-6'>
					<Link to='/' className='inline-flex items-center text-forest'>
						<ArrowLeft className='w-4 h-4 mr-2' />
						Bosh sahifaga qaytish
					</Link>
				</div>

				<Tabs value={activeTab} onValueChange={val => setActiveTab(val as any)}>
					<TabsList className='grid grid-cols-2 mb-4'>
						<TabsTrigger value='register'>Ro`yxatdan o`tish</TabsTrigger>
						<TabsTrigger value='login'>Kirish</TabsTrigger>
					</TabsList>

					<TabsContent value='register'>
						<form onSubmit={handleRegister} className='space-y-4'>
							<h2 className='text-xl font-bold text-forest'>
								Ro`yxatdan o`tish
							</h2>

							<div className='flex gap-2'>
								{(['buyer', 'seller'] as const).map(r => (
									<div
										key={r}
										className={`flex-1 border p-2 rounded cursor-pointer ${
											type === r
												? 'bg-sage/50 border-2 border-forest'
												: 'border'
										}`}
										onClick={() => setType(r)}
									>
										{r === 'buyer' ? <User /> : <Store />}
										<p>{r === 'buyer' ? 'Xaridor' : 'Sotuvchi'}</p>
									</div>
								))}
							</div>

							<Input
								placeholder='Ism Familiya'
								value={fullName}
								onChange={e => setFullName(e.target.value)}
							/>
							{errors.fullName && (
								<p className='text-red-500'>{errors.fullName}</p>
							)}

							<Input
								placeholder='Email'
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
							{errors.email && <p className='text-red-500'>{errors.email}</p>}

							<Input
								placeholder='Telefon (+998...)'
								value={phone}
								onChange={e => setPhone(e.target.value)}
							/>
							{errors.phone && <p className='text-red-500'>{errors.phone}</p>}

							<div className='relative'>
								<Input
									placeholder='Parol'
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-2 top-1/2 -translate-y-1/2'
								>
									{showPassword ? <EyeOffIcon /> : <EyeIcon />}
								</button>
							</div>
							{errors.password && (
								<p className='text-red-500'>{errors.password}</p>
							)}

							{type === 'seller' && (
								<div className='space-y-4 border-t pt-4'>
									<Input
										placeholder='Biznes nomi'
										value={businessName}
										onChange={e => setBusinessName(e.target.value)}
									/>
									<Input
										placeholder='Manzil'
										value={address}
										onChange={e => setAddress(e.target.value)}
									/>
									<select
										value={region}
										onChange={e => setRegion(e.target.value)}
										className='w-full border p-2 rounded'
									>
										<option value=''>Viloyatni tanlang</option>
										<option value='toshkent'>Toshkent</option>
										<option value='samarqand'>Samarqand</option>
										<option value='fargona'>Farg`ona</option>
										<option value='buxoro'>Buxoro</option>
										<option value='xorazm'>Xorazm</option>
										<option value='namangan'>Namangan</option>
										<option value='andijon'>Andijon</option>
										<option value='jizzax'>Jizzax</option>
										<option value='qashqadaryo'>Qashqadaryo</option>
										<option value='surxondaryo'>Surxondaryo</option>
										<option value='sirdaryo'>Sirdaryo</option>
										<option value='qoraqalpogiston'>Qoraqalpog`iston</option>
									</select>
									<select
										value={experience}
										onChange={e => setExperience(e.target.value)}
										className='w-full border p-2 rounded'
									>
										<option value=''>Tajriba</option>
										<option value='1'>1 yilgacha</option>
										<option value='1-3'>1-3 yil</option>
										<option value='3-5'>3-5 yil</option>
										<option value='5-10'>5-10 yil</option>
										<option value='10+'>10 yildan ortiq</option>
									</select>
									<p className='text-sm text-muted-foreground'>
										Admin arizangizni 24-48 soatda ko`rib chiqadi.
									</p>
								</div>
							)}

							<Button
								type='submit'
								className='w-full bg-gradient-to-r from-forest to-moss'
							>
								{loading ? 'Yuborilmoqda...' : 'Ro`yxatdan o`tish'}
							</Button>
						</form>
					</TabsContent>

					<TabsContent value='login'>
						<div className='space-y-4'>
							<div className='flex gap-2'>
								{(['buyer', 'seller'] as const).map(r => (
									<div
										key={r}
										className={`flex-1 border p-2 rounded cursor-pointer ${
											type === r
												? 'bg-sage/50 border-2 border-forest'
												: 'border'
										}`}
										onClick={() => setType(r)}
									>
										{r === 'buyer' ? <User /> : <Store />}
										<p>{r === 'buyer' ? 'Xaridor' : 'Sotuvchi'}</p>
									</div>
								))}
							</div>

							<Input
								placeholder='Email'
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
							{errors.email && <p className='text-red-500'>{errors.email}</p>}

							<Button
								onClick={handleRequestOtp}
								className='w-full bg-gradient-to-r from-forest to-moss'
							>
								{loading ? 'Yuborilmoqda...' : 'Emailga kod yuborish'}
							</Button>
						</div>

						<form onSubmit={handleLogin} className='space-y-4 mt-4'>
							<h2 className='text-xl font-bold text-forest'>Kirish</h2>

							<Input
								placeholder='Email'
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
							<div className='relative'>
								<Input
									placeholder='Parol'
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={e => setPassword(e.target.value)}
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-2 top-1/2 -translate-y-1/2'
								>
									{showPassword ? <EyeOffIcon /> : <EyeIcon />}
								</button>
							</div>

							<Input
								placeholder='Emailga kelgan kodni kiriting'
								value={otp}
								onChange={e => setOtp(e.target.value)}
							/>

							<Button
								type='submit'
								className='w-full bg-gradient-to-r from-forest to-moss'
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
