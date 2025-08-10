import React, { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-toastify'
import { getMyOrders, getSellerProfile } from '@/services/productService'
import DashboardTab from '@/components/sellerDashboard/DashboardTab'
import ProductsTab from '@/components/sellerDashboard/ProductsTab'
import OrdersTab from '@/components/sellerDashboard/OrdersTab'
import ProfileTab from '@/components/sellerDashboard/ProfileTab'
import { UserProfile, Order } from '@/types/types'

const SellerDashboard = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const initialTab = searchParams.get('tab') || 'dashboard'
	const [activeTab, setActiveTab] = useState(initialTab)
	const [pendingOrders, setPendingOrders] = useState(0)
	const [user, setUser] = useState<UserProfile>({
		id: localStorage.getItem('userId') || '',
		fullName: localStorage.getItem('fullname') || '',
		email: localStorage.getItem('email') || '',
		phone: '',
		role:
			(localStorage.getItem('role') as 'user' | 'admin' | 'seller') || 'user',
		sellerInfo: (() => {
			try {
				const sellerInfo = localStorage.getItem('sellerInfo')
				return sellerInfo ? JSON.parse(sellerInfo) : undefined
			} catch {
				return undefined
			}
		})(),
	})
	const navigate = useNavigate()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const profile = await getSellerProfile()
				setUser(profile)
				localStorage.setItem('userId', profile.id)
				localStorage.setItem('fullname', profile.fullName)
				localStorage.setItem('email', profile.email)
				localStorage.setItem('role', profile.role)
				if (profile.sellerInfo) {
					localStorage.setItem('sellerInfo', JSON.stringify(profile.sellerInfo))
				}
			} catch (error) {
				toast.error("Profil ma'lumotlarini yuklashda xatolik yuz berdi")
				navigate('/auth')
			}

			try {
				const orders: Order[] = await getMyOrders()
				const pendingCount = orders.filter(
					order => order.status === 'panding'
				).length
				setPendingOrders(pendingCount)
			} catch (error) {
				toast.error('Buyurtmalarni yuklashda xatolik yuz berdi')
			}
		}
		fetchData()
	}, [navigate])

	const handleTabChange = (value: string) => {
		setActiveTab(value)
		setSearchParams({ tab: value })
	}

	const handleLogout = () => {
		localStorage.removeItem('userId')
		localStorage.removeItem('fullname')
		localStorage.removeItem('email')
		localStorage.removeItem('role')
		localStorage.removeItem('sellerInfo')
		localStorage.removeItem('access_token')
		navigate('/auth')
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-sage via-accent to-background'>
			<div className='bg-card/90 backdrop-blur-sm border-b shadow-card'>
				<div className='container mx-auto px-4 py-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-4'>
							<Link
								to='/'
								className='inline-flex items-center text-forest hover:text-forest-light transition-colors'
							>
								<ArrowLeft className='w-4 h-4 mr-2' />
								Asosiy sahifa
							</Link>
							<div className='h-6 w-px bg-border'></div>
							<h1 className='text-2xl font-bold text-forest'>
								Sotuvchi Paneli
							</h1>
						</div>
						<div className='flex items-center space-x-4'>
							<span className='text-muted-foreground'>
								Salom, {user.fullName}
							</span>
							<Button variant='outline' size='sm' onClick={handleLogout}>
								Chiqish
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className='container mx-auto px-4 py-6'>
				<Tabs
					value={activeTab}
					onValueChange={handleTabChange}
					className='space-y-6'
				>
					<TabsList className='grid w-full grid-cols-[repeat(auto-fit,minmax(100px,1fr))]'>
						<TabsTrigger value='dashboard'>Bosh sahifa</TabsTrigger>
						<TabsTrigger value='products'>Mahsulotlar</TabsTrigger>
						<TabsTrigger value='orders'>
							Buyurtmalar{' '}
							{pendingOrders > 0 && (
								<Badge variant='destructive' className='ml-2'>
									{pendingOrders}
								</Badge>
							)}
						</TabsTrigger>
						<TabsTrigger value='profile'>Profil</TabsTrigger>
					</TabsList>

					<TabsContent value='dashboard'>
						<DashboardTab />
					</TabsContent>
					<TabsContent value='products'>
						<ProductsTab />
					</TabsContent>
					<TabsContent value='orders'>
						<OrdersTab />
					</TabsContent>
					<TabsContent value='profile'>
						<ProfileTab user={user} setUser={setUser} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}

export default SellerDashboard
