import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import BrowseTab from '@/components/userDashboard/BrowseTab'
import OrdersTab from '@/components/userDashboard/OrdersTab'
import FavoritesTab from '@/components/userDashboard/FavoritesTab'
import ProfileTab from '@/components/userDashboard/ProfileTab'
import { UserProfile } from '@/types/types'

const UserDashboard = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const initialTab = searchParams.get('tab') || 'browse'
	const [activeTab, setActiveTab] = useState(initialTab)
	const [user, setUser] = useState<UserProfile>({
		id: localStorage.getItem('userId') || '',
		fullName: localStorage.getItem('fullName') || '',
		email: localStorage.getItem('email') || '',
		phone: '',
		role:
			(localStorage.getItem('role') as 'user' | 'admin' | 'seller') || 'user',
		sellerInfo: localStorage.getItem('sellerInfo')
			? JSON.parse(localStorage.getItem('sellerInfo')!)
			: undefined,
	})
	const navigate = useNavigate()

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const role = localStorage.getItem('role') as
					| 'user'
					| 'admin'
					| 'seller'
					| null
				if (!role) {
					navigate('/auth')
					return
				}
			} catch (err) {
				navigate('/auth')
			}
		}
		fetchProfile()
	}, [navigate])

	useEffect(() => {
		setSearchParams({ tab: activeTab })
	}, [activeTab, setSearchParams])

	const handleTab = (tab: string) => {
		setActiveTab(tab)
	}

	const handleLogout = () => {
		localStorage.clear()
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
							<h1 className='text-2xl font-bold text-forest'>Xaridor Paneli</h1>
						</div>
						<div className='flex items-center space-x-4'>
							<span className='text-muted-foreground'>
								Salom, {user.fullName || 'Foydalanuvchi'}
							</span>
							<Button variant='outline' size='sm' onClick={handleLogout}>
								Chiqish
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className='container mx-auto px-4 py-6'>
				<Tabs value={activeTab} onValueChange={handleTab} className='space-y-6'>
					<TabsList className='grid w-full grid-cols-4'>
						<TabsTrigger value='browse'>Ko'chatlar</TabsTrigger>
						<TabsTrigger value='orders'>Buyurtmalarim</TabsTrigger>
						<TabsTrigger value='favorites'>Sevimlilar</TabsTrigger>
						<TabsTrigger value='profile'>Profil</TabsTrigger>
					</TabsList>

					<TabsContent value='browse'>
						<BrowseTab user={user} setUser={setUser} />
					</TabsContent>
					<TabsContent value='orders'>
						<OrdersTab user={user} setUser={setUser} />
					</TabsContent>
					<TabsContent value='favorites'>
						<FavoritesTab user={user} setUser={setUser} />
					</TabsContent>
					<TabsContent value='profile'>
						<ProfileTab
							user={user}
							setUser={setUser}
							handleLogout={handleLogout}
						/>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}

export default UserDashboard
