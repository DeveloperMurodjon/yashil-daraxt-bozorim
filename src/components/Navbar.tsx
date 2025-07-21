import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Menu, X, Search, ShoppingCart, User, Heart, Leaf } from 'lucide-react'

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	useEffect(() => {
		const token = localStorage.getItem('access_token')
		setIsLoggedIn(!!token)
	}, [])

	const navigationItems = [
		{ name: 'Bosh Sahifa', href: '/' },
		{ name: 'Kategoriyalar', href: '/categories' },
		{ name: 'Mashhur', href: '/popular' },
		{ name: 'Yangi', href: '/new' },
		{ name: "Bog'ga Oid", href: '/garden' },
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
						<Button variant='ghost' size='icon' className='hover:bg-sage/50'>
							<Search className='h-5 w-5' />
						</Button>

						<Button variant='ghost' size='icon' className='hover:bg-sage/50'>
							<Heart className='h-5 w-5' />
						</Button>

						<Button
							variant='ghost'
							size='icon'
							className='relative hover:bg-sage/50'
						>
							<ShoppingCart className='h-5 w-5' />
							<Badge className='absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-forest text-primary-foreground'>
								3
							</Badge>
						</Button>

						{isLoggedIn ? (
							<Link to='/profile'>
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
						<Button variant='ghost' size='icon' className='relative'>
							<ShoppingCart className='h-5 w-5' />
							<Badge className='absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-forest text-primary-foreground'>
								3
							</Badge>
						</Button>

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
					<div className='md:hidden absolute top-16 left-0 right-0 bg-card/98 backdrop-blur-md border-b border-border shadow-lg'>
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
								<Button variant='outline' className='w-full justify-start'>
									<Search className='h-4 w-4 mr-2' />
									Qidirish
								</Button>

								<Button variant='outline' className='w-full justify-start'>
									<Heart className='h-4 w-4 mr-2' />
									Sevimlilar
								</Button>

								{isLoggedIn ? (
									<Link to='/profile'>
										<Button variant='outline' className='w-full justify-start'>
											<User className='h-4 w-4 mr-2' />
											Profil
										</Button>
									</Link>
								) : (
									<Link to='/auth'>
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
