import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ProductIcon from '@/assets/product.svg'
import DashboardIcon from '@/assets/dashboard.svg'
import { Menu, X, Search, ShoppingCart, User, Heart, Leaf } from 'lucide-react'
import { getUserOrders } from '@/services/productService'

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [orderCount, setOrderCount] = useState(0)
	const role = localStorage.getItem('role')
	const navigate = useNavigate()

	useEffect(() => {
		const token = localStorage.getItem('access_token')
		setIsLoggedIn(!!token)

		const fetchOrderCount = async () => {
			if (token) {
				try {
					const orders = await getUserOrders()
					setOrderCount(orders.length)
				} catch (error) {
					console.error('Buyurtmalar sonini yuklashda xatolik:', error)
					setOrderCount(0)
				}
			} else {
				setOrderCount(0)
			}
		}
		fetchOrderCount()
	}, [role, isLoggedIn])

	const getDashboardLink = (tab: string) => {
		if (!isLoggedIn) return '/auth'

		if (role === 'user') {
			const userTabs = {
				browse: '/user-dashboard?tab=browse',
				favorites: '/user-dashboard?tab=favorites',
				orders: '/user-dashboard?tab=orders',
			}
			return userTabs[tab] || '/user-dashboard?tab=browse'
		} else if (role === 'saller') {
			const sellerTabs = {
				dashboard: '/seller-dashboard?tab=dashboard',
				products: '/seller-dashboard?tab=products',
				orders: '/seller-dashboard?tab=orders',
			}
			return sellerTabs[tab] || '/seller-dashboard?tab=dashboard'
		}
		return '/auth'
	}

	const navigationItems = [
		{ name: 'Bosh Sahifa', href: '/' },
		{ name: 'Kategoriyalar', href: '/categories' },
		{ name: 'Yangi', href: '/new' },
	]

	return (
		<nav className='fixed top-0 w-full z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-card'>
			<div className='container mx-auto px-4'>
				<div className='flex items-center justify-between h-16'>
					{/* Logo */}
					<div className='flex items-center space-x-2'>
						<div className='p-2 bg-gradient-to-br from-forest to-moss rounded-xl shadow-card'>
							<Leaf className='h-6 w-6 text-primary-foreground' />
						</div>
						<div>
							<h1 className='text-xl font-bold text-foreground'>Ko'chatlar</h1>
							<p className='text-xs text-muted-foreground -mt-1'>Bozori</p>
						</div>
					</div>

					{/* Desktop Navigation */}
					<div className='hidden md:flex items-center space-x-8'>
						{navigationItems.map(item => (
							<Link
								key={item.name}
								to={item.href}
								className='text-foreground hover:text-forest transition-colors duration-200 font-medium'
							>
								{item.name}
							</Link>
						))}
					</div>

					{/* Desktop Actions */}
					<div className='hidden md:flex items-center space-x-4'>
						<Link
							to={getDashboardLink(role === 'user' ? 'browse' : 'dashboard')}
						>
							<Button variant='ghost' size='icon' className='hover:bg-sage/50'>
								{role === 'saller' ? (
									<img
										src={DashboardIcon}
										alt='Dashboard Icon'
										className='h-5 w-5'
									/>
								) : (
									<Search className='h-5 w-5' />
								)}
							</Button>
						</Link>

						<Link
							to={getDashboardLink(role === 'user' ? 'favorites' : 'products')}
						>
							<Button variant='ghost' size='icon' className='hover:bg-sage/50'>
								{role === 'saller' ? (
									<img
										src={ProductIcon}
										alt='Product Icon'
										className='h-5 w-5'
									/>
								) : (
									<Heart className='h-5 w-5' />
								)}
							</Button>
						</Link>

						<Link to={getDashboardLink('orders')}>
							<Button
								variant='ghost'
								size='icon'
								className='relative hover:bg-sage/50'
							>
								<ShoppingCart className='h-5 w-5' />
								{orderCount > 0 && (
									<Badge className='absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center text-xs bg-forest text-primary-foreground'>
										{orderCount}
									</Badge>
								)}
							</Button>
						</Link>

						{isLoggedIn ? (
							<Link
								to={
									role === 'user'
										? '/user-dashboard?tab=profile'
										: role === 'saller'
										? '/seller-dashboard?tab=profile'
										: '/'
								}
							>
								<Button className='bg-gradient-to-r from-forest to-moss'>
									Profil
								</Button>
							</Link>
						) : (
							<Link to='/auth'>
								<Button className='bg-gradient-to-r from-forest to-moss'>
									Kirish
								</Button>
							</Link>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className='md:hidden flex items-center space-x-2'>
						<Link to={getDashboardLink('orders')}>
							<Button variant='ghost' size='icon' className='relative'>
								<ShoppingCart className='h-5 w-5' />
								{orderCount > 0 && (
									<Badge className='absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center text-xs bg-forest text-primary-foreground'>
										{orderCount}
									</Badge>
								)}
							</Button>
						</Link>

						<Button
							variant='ghost'
							size='icon'
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							{isMenuOpen ? (
								<X className='h-6 w-6' />
							) : (
								<Menu className='h-6 w-6' />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className='md:hidden absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg'>
						<div className='px-4 py-6 space-y-4'>
							{navigationItems.map(item => (
								<Link
									key={item.name}
									to={item.href}
									className='block py-2 text-foreground hover:text-forest transition-colors font-medium'
									onClick={() => setIsMenuOpen(false)}
								>
									{item.name}
								</Link>
							))}

							<div className='pt-4 border-t border-border space-y-3'>
								<Link
									to={getDashboardLink(
										role === 'user' ? 'browse' : 'dashboard'
									)}
									onClick={() => setIsMenuOpen(false)}
								>
									<Button variant='outline' className='w-full justify-start'>
										{role === 'saller' ? (
											<img
												src={DashboardIcon}
												alt='Dashboard Icon'
												className='h-4 w-4 mr-2'
											/>
										) : (
											<Search className='h-4 w-4 mr-2' />
										)}
										{role === 'saller' ? 'Dashboard' : 'Qidirish'}
									</Button>
								</Link>

								<Link
									to={getDashboardLink(
										role === 'user' ? 'favorites' : 'products'
									)}
									onClick={() => setIsMenuOpen(false)}
								>
									<Button variant='outline' className='w-full justify-start'>
										{role === 'saller' ? (
											<img
												src={ProductIcon}
												alt='Product Icon'
												className='h-4 w-4 mr-2'
											/>
										) : (
											<Heart className='h-4 w-4 mr-2' />
										)}
										{role === 'saller' ? 'Mahsulotlar' : 'Sevimlilar'}
									</Button>
								</Link>

								{isLoggedIn ? (
									<Link
										to={
											role === 'saller'
												? '/seller-dashboard?tab=profile'
												: role === 'user'
												? '/user-dashboard?tab=profile'
												: ''
										}
										onClick={() => setIsMenuOpen(false)}
									>
										<Button variant='outline' className='w-full justify-start'>
											<User className='h-4 w-4 mr-2' />
											Profil
										</Button>
									</Link>
								) : (
									<Link to='/auth' onClick={() => setIsMenuOpen(false)}>
										<Button className='w-full bg-gradient-to-r from-forest to-moss'>
											Kirish
										</Button>
									</Link>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	)
}

export default Navbar
