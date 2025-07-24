import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, LogOut, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-toastify'
import { api } from '@/lib/api'

interface SellerInfo {
	businessName: string
	address: string
	experience: string
}

export default function Profile() {
	const [user, setUser] = useState({ email: '', role: '', userId: '' })
	const [sellerInfo, setSellerInfo] = useState<SellerInfo>({
		businessName: '',
		address: '',
		experience: '',
	})
	const navigate = useNavigate()

	useEffect(() => {
		const email = localStorage.getItem('email') || ''
		const role = localStorage.getItem('role') || ''
		const userId = localStorage.getItem('userId') || ''
		setUser({ email, role, userId })

		if (role === 'seller') {
			setSellerInfo({
				businessName: localStorage.getItem('businessName') || '',
				address: localStorage.getItem('address') || '',
				experience: localStorage.getItem('experience') || '',
			})
		}
	}, [])

	const handleLogout = () => {
		localStorage.clear()
		toast.success('Tizimdan chiqdingiz', {
			icon: <CheckCircle className='w-5 h-5 text-forest' />,
		})
		navigate('/auth')
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-muted p-4 sm:p-6'>
			<Card className='w-full max-w-md border-forest/20'>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<CardTitle className='text-xl font-bold text-forest'>
							Profil
						</CardTitle>
						<Link
							to='/'
							className='inline-flex items-center text-forest hover:text-forest/80 text-sm'
						>
							<ArrowLeft className='w-4 h-4 mr-2' />
							Bosh sahifaga qaytish
						</Link>
					</div>
					<p className='text-sm text-muted-foreground'>
						Shaxsiy ma’lumotlaringiz
					</p>
				</CardHeader>
				<CardContent className='space-y-6'>
					<div className='space-y-2'>
						<div className='flex items-center'>
							<span className='w-1/3 font-medium text-forest'>Email:</span>
							<span className='text-forest'>{user.email || 'Noma’lum'}</span>
						</div>
						<div className='flex items-center'>
							<span className='w-1/3 font-medium text-forest'>Rol:</span>
							<span className='text-forest'>
								{user.role === 'buyer'
									? 'Xaridor'
									: user.role === 'seller'
									? 'Sotuvchi'
									: user.role === 'admin'
									? 'Admin'
									: 'Noma’lum'}
							</span>
						</div>
						<div className='flex items-center'>
							<span className='w-1/3 font-medium text-forest'>ID:</span>
							<span className='text-forest'>{user.userId || 'Noma’lum'}</span>
						</div>
					</div>

					{user.role === 'seller' && (
						<div className='border-t pt-4 space-y-2 border-forest/20'>
							<h3 className='font-semibold text-forest'>
								Qo`shimcha ma’lumotlar:
							</h3>
							<div className='flex items-center'>
								<span className='w-1/3 font-medium text-forest'>
									Biznes nomi:
								</span>
								<span className='text-forest'>
									{sellerInfo.businessName || 'Noma’lum'}
								</span>
							</div>
							<div className='flex items-center'>
								<span className='w-1/3 font-medium text-forest'>Manzil:</span>
								<span className='text-forest'>
									{sellerInfo.address || 'Noma’lum'}
								</span>
							</div>
							<div className='flex items-center'>
								<span className='w-1/3 font-medium text-forest'>Tajriba:</span>
								<span className='text-forest'>
									{sellerInfo.experience
										? `${sellerInfo.experience} yil`
										: 'Noma’lum'}
								</span>
							</div>
						</div>
					)}

					<div className='flex flex-col gap-2 pt-4 border-t border-forest/20'>
						<Button
							onClick={handleLogout}
							variant='outline'
							className='w-full border-forest/20 text-forest hover:bg-sage/20'
						>
							<LogOut className='w-4 h-4 mr-2' /> Chiqish
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
