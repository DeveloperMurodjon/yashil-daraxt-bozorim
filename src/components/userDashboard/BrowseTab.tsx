import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Search,
	Filter,
	Heart,
	ShoppingCart,
	Eye,
	Phone,
	MapPin,
	CheckCircle,
	AlertCircle,
	X,
	Plus,
	Minus,
} from 'lucide-react'
import { Product, UserProfile } from '@/types/types'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-toastify'
import { Label } from '../ui/label'
import {
	createOrder,
	filterProducts,
	toggleLike,
	getUserFavorites,
} from '@/services/productService'

interface BrowseTabProps {
	user: UserProfile
	setUser: (user: UserProfile) => void
}

const BrowseTab: React.FC<BrowseTabProps> = ({ user, setUser }) => {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategory, setSelectedCategory] = useState('all')
	const [selectedRegion, setSelectedRegion] = useState('all')
	const [favorites, setFavorites] = useState<number[]>([])
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
	const [showOrderDialog, setShowOrderDialog] = useState(false)
	const [quantity, setQuantity] = useState(1)

	const location = useLocation()
	const navigate = useNavigate()

	const isFilterActive =
		searchQuery !== '' || selectedCategory !== 'all' || selectedRegion !== 'all'

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true)
				const token = localStorage.getItem('access_token')
				if (!token) {
					toast.error('Tizimga kirish talab qilinadi')
					navigate('/auth')
					return
				}

				const queryParams = new URLSearchParams(location.search)
				const filterParams: Record<string, string> = {}
				if (queryParams.get('name')) {
					filterParams.name = queryParams.get('name')!
					setSearchQuery(queryParams.get('name')!)
				}
				if (queryParams.get('category')) {
					filterParams.category = queryParams.get('category')!
					setSelectedCategory(queryParams.get('category')!)
				}
				if (queryParams.get('region')) {
					filterParams.region = queryParams.get('region')!
					setSelectedRegion(queryParams.get('region')!)
				}

				const cleanParams = Object.fromEntries(
					Object.entries(filterParams).filter(
						([_, value]) => value && value !== 'all'
					)
				)

				const [productsResponse, favoritesResponse] = await Promise.all([
					filterProducts(cleanParams),
					getUserFavorites(),
				])

				console.log('Products response:', productsResponse)
				console.log('Favorites response:', favoritesResponse)

				setProducts(productsResponse.data)
				setFavorites(favoritesResponse.map(fav => fav.product.id))
				setLoading(false)
			} catch (err) {
				console.error('Ma`lumotlarni yuklashda xatolik:', {
					message: err.message,
					response: err.response?.data,
					status: err.response?.status,
				})
				setError(
					err.response?.data?.message ||
						'Mahsulotlarni yuklashda xatolik yuz berdi'
				)
				setLoading(false)
			}
		}
		fetchProducts()
	}, [location.search, navigate])

	const handleFilter = async () => {
		try {
			setLoading(true)
			const filterParams: Record<string, string> = {}
			if (searchQuery) filterParams.name = searchQuery
			if (selectedCategory !== 'all') filterParams.category = selectedCategory
			if (selectedRegion !== 'all') filterParams.region = selectedRegion

			const cleanParams = Object.fromEntries(
				Object.entries(filterParams).filter(
					([_, value]) => value && value !== 'all'
				)
			)

			const queryString = new URLSearchParams(cleanParams).toString()
			navigate(`/user-dashboard?${queryString}`)

			const response = await filterProducts(cleanParams)
			console.log('Filter response:', response)
			setProducts(response.data)
			setLoading(false)
		} catch (err) {
			console.error('Filterlashda xatolik:', {
				message: err.message,
				response: err.response?.data,
				status: err.response?.status,
			})
			setError(err.response?.data?.message || 'Filterlashda xatolik yuz berdi')
			setLoading(false)
		}
	}

	const handleClearFilter = () => {
		setSearchQuery('')
		setSelectedCategory('all')
		setSelectedRegion('all')
		navigate('/user-dashboard')
		setLoading(true)
		filterProducts({})
			.then(response => {
				console.log('Clear filter response:', response)
				setProducts(response.data)
				setLoading(false)
			})
			.catch(err => {
				console.error('Filtrlarni tozalashda xatolik:', {
					message: err.message,
					response: err.response?.data,
					status: err.response?.status,
				})
				setError(
					err.response?.data?.message ||
						'Filtrlarni tozalashda xatolik yuz berdi'
				)
				setLoading(false)
			})
	}

	const handleToggleLike = async (productId: number) => {
		try {
			const response = await toggleLike(productId)
			toast.success(response.message)
			if (response.liked) {
				setFavorites([...favorites, productId])
			} else {
				setFavorites(favorites.filter(fav => fav !== productId))
			}
		} catch (error) {
			console.error('Like/dislike xatosi:', {
				message: error.message,
				response: error.response?.data,
				status: error.response?.status,
			})
			toast.error(
				error.response?.data?.message ||
					'Like/dislike qilishda xatolik yuz berdi',
				{
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				}
			)
		}
	}

	const handleOrderSubmit = async () => {
		if (!selectedProduct) return
		try {
			const orderData = {
				userId: parseInt(user.id),
				productId: selectedProduct.id,
				quantity,
			}
			await createOrder(orderData)
			setShowOrderDialog(false)
			setQuantity(1)
			toast.success('Buyurtma muvaffaqiyatli joylashtirildi', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
		} catch (error) {
			console.error('Buyurtma berishda xatolik:', {
				message: error.message,
				response: error.response?.data,
				status: error.response?.status,
			})
			toast.error(
				error.response?.data?.message || 'Buyurtma berishda xatolik',
				{
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				}
			)
		}
	}

	const handleQuantityChange = (change: number) => {
		setQuantity(prev => {
			const newQuantity = prev + change
			return newQuantity < 1
				? 1
				: newQuantity > (selectedProduct?.stock || 1)
				? selectedProduct?.stock || 1
				: newQuantity
		})
	}

	const handleContactSeller = (phone: string) => {
		window.location.href = `tel:${phone}`
	}

	return (
		<div className='space-y-6'>
			<Card className='shadow-card'>
				<CardContent className='p-4'>
					<div className='flex md:items-end flex-col md:flex-row gap-4'>
						<div className='flex-1 relative'>
							<Label>Ko'chat nomi</Label>
							<Input
								placeholder="Ko'chatlar qidirish..."
								className='pl-10'
								value={searchQuery}
								onChange={e => {
									const value = e.target.value
									const capitalizedValue = value
										? value.charAt(0).toUpperCase() + value.slice(1)
										: ''
									setSearchQuery(capitalizedValue)
								}}
							/>
							<Search className='absolute left-3 top-11 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
						</div>
						<div>
							<Label>Ko'chat turi</Label>
							<Select
								value={selectedCategory}
								onValueChange={setSelectedCategory}
							>
								<SelectTrigger className='w-full md:w-48'>
									<SelectValue placeholder='Kategoriya' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>Barcha kategoriyalar</SelectItem>
									<SelectItem value='1'>Ko'chat</SelectItem>
									<SelectItem value='2'>Meva daraxtlari</SelectItem>
									<SelectItem value='3'>Manzarali daraxtlar</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Hududlar</Label>
							<Select value={selectedRegion} onValueChange={setSelectedRegion}>
								<SelectTrigger className='w-full md:w-48'>
									<SelectValue placeholder='Viloyat' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>Barcha viloyatlar</SelectItem>
									<SelectItem value='Andijon'>Andijon</SelectItem>
									<SelectItem value='Buxoro'>Buxoro</SelectItem>
									<SelectItem value='Farg`ona'>Farg`ona</SelectItem>
									<SelectItem value='Jizzax'>Jizzax</SelectItem>
									<SelectItem value='Xorazm'>Xorazm</SelectItem>
									<SelectItem value='Namangan'>Namangan</SelectItem>
									<SelectItem value='Navoiy'>Navoiy</SelectItem>
									<SelectItem value='Qashqadaryo'>Qashqadaryo</SelectItem>
									<SelectItem value='Qoraqalpog`iston'>
										Qoraqalpog`iston Respublikasi
									</SelectItem>
									<SelectItem value='Samarqand'>Samarqand</SelectItem>
									<SelectItem value='Sirdaryo'>Sirdaryo</SelectItem>
									<SelectItem value='Surxondaryo'>Surxondaryo</SelectItem>
									<SelectItem value='Toshkent'>Toshkent</SelectItem>
									<SelectItem value='Toshkent shahri'>
										Toshkent shahri
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button variant='outline' onClick={handleFilter}>
							<Filter className='w-4 h-4 mr-2' />
							Filter
						</Button>
						<Button
							variant={isFilterActive ? 'destructive' : 'outline'}
							onClick={handleClearFilter}
						>
							<X className='w-4 h-4 mr-2' />
							Tozalash
						</Button>
					</div>
				</CardContent>
			</Card>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{loading ? (
					<p className='text-center'>Yuklanmoqda...</p>
				) : error ? (
					<p className='text-center text-red-500'>{error}</p>
				) : products.length === 0 ? (
					<p className='text-center'>Mahsulotlar topilmadi</p>
				) : (
					products.map(product => (
						<Card
							key={product.id}
							className='shadow-card hover:shadow-nature transition-shadow duration-300'
						>
							<CardContent className='p-0'>
								<div className='aspect-square bg-sage/30 rounded-t-lg flex items-center justify-center'>
									<img
										src={product.images[0]?.ImageUrl || '/placeholder-tree.jpg'}
										alt={product.name}
										className='w-full h-full object-cover rounded-t-lg'
									/>
								</div>

								<div className='p-4 space-y-3'>
									<div className='flex justify-between items-start'>
										<h3 className='font-semibold text-forest'>
											{product.name}
										</h3>
										<Button
											size='sm'
											variant='ghost'
											className='p-1'
											onClick={() => handleToggleLike(product.id)}
										>
											<Heart
												className={`w-4 h-4 ${
													favorites.includes(product.id)
														? 'fill-red-500 text-red-500'
														: ''
												}`}
											/>
										</Button>
									</div>

									<div className='space-y-2 text-sm'>
										<p className='font-medium text-forest'>
											Manzil: {product.region}
										</p>
										<p className='text-muted-foreground'>
											Ko`chat turi: {product.category.name}
										</p>
										<p className='font-bold text-forest'>
											Narxi: {product.price.toLocaleString()} so'm
										</p>
										<p className='text-muted-foreground'>
											Umumiy soni: {product.stock} dona
										</p>
									</div>

									<div className='flex space-x-2'>
										<Dialog>
											<DialogTrigger asChild>
												<Button size='sm' variant='outline' className='flex-1'>
													<Eye className='w-4 h-4 mr-1' />
													Ko'rish
												</Button>
											</DialogTrigger>
											<DialogContent className='max-w-md'>
												<DialogHeader>
													<DialogTitle className='text-forest'>
														{product.name}
													</DialogTitle>
												</DialogHeader>
												<div className='space-y-4'>
													<div className='aspect-video bg-sage/30 rounded-lg flex items-center justify-center'>
														<img
															src={
																product.images[0]?.ImageUrl ||
																'/placeholder-tree.jpg'
															}
															alt={product.name}
															className='w-full h-full object-cover rounded-lg'
														/>
													</div>

													<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
														<div className='space-y-4'>
															<div>
																<h4 className='font-semibold text-forest mb-2'>
																	Mahsulot haqida
																</h4>
																<p className='text-muted-foreground'>
																	Balandligi: {product.height}m, Yoshi:{' '}
																	{product.age} yil
																</p>
															</div>
															<div>
																<h4 className='font-semibold text-forest mb-2'>
																	Kategoriya
																</h4>
																<Badge>{product.category.name}</Badge>
															</div>
														</div>

														<div className='space-y-4'>
															<div>
																<h4 className='font-semibold text-forest mb-2'>
																	Sotuvchi
																</h4>
																<div className='space-y-2'>
																	<p className='font-medium'>
																		{product.saller.businessName}
																	</p>
																	<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
																		<MapPin className='w-4 h-4' />
																		<span>{product.region}</span>
																	</div>
																	<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
																		<Phone className='w-4 h-4' />
																		<span>{product.saller.phone}</span>
																	</div>
																</div>
															</div>

															<div className='space-y-3'>
																<div className='flex justify-between items-center'>
																	<span className='text-2xl font-bold text-forest'>
																		{product.price.toLocaleString()} so'm
																	</span>
																	<Badge
																		variant={
																			product.stock > 0
																				? 'default'
																				: 'secondary'
																		}
																	>
																		{product.stock > 0
																			? `${product.stock} dona mavjud`
																			: 'Tugagan'}
																	</Badge>
																</div>

																<div className='space-y-2'>
																	<Button
																		className='w-full bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest'
																		disabled={product.stock === 0}
																		onClick={() => {
																			setSelectedProduct(product)
																			setShowOrderDialog(true)
																		}}
																	>
																		<ShoppingCart className='w-4 h-4 mr-2' />
																		Buyurtma berish
																	</Button>
																	<Button
																		variant='outline'
																		className='w-full'
																		onClick={() =>
																			handleContactSeller(product.saller.phone)
																		}
																	>
																		<Phone className='w-4 h-4 mr-2' />
																		Sotuvchi bilan bog'lanish
																	</Button>
																</div>
															</div>
														</div>
													</div>
												</div>
											</DialogContent>
										</Dialog>

										<Button
											size='sm'
											className='flex-1 bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest'
											disabled={product.stock === 0}
											onClick={() => {
												setSelectedProduct(product)
												setShowOrderDialog(true)
											}}
										>
											<ShoppingCart className='w-4 h-4 mr-1' />
											Buyurtma
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>

			<Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
				<DialogContent className='max-w-xl'>
					<DialogHeader>
						<DialogTitle className='text-forest'>Buyurtma berish</DialogTitle>
					</DialogHeader>
					{selectedProduct && (
						<div className='space-y-4'>
							<div className='p-4 bg-sage/30 rounded-lg'>
								<h4 className='font-medium text-forest'>
									{selectedProduct.name}
								</h4>
								<p className='text-sm text-muted-foreground'>
									{selectedProduct.saller.businessName}
								</p>
								<p className='text-sm text-muted-foreground'>
									Manzil: {selectedProduct.region}
								</p>
								<p className='text-sm text-muted-foreground'>
									Ko`chat turi: {selectedProduct.category.name}
								</p>
								<p className='text-sm text-muted-foreground'>
									Balandligi: {selectedProduct.height}m, Yoshi:{' '}
									{selectedProduct.age} yil
								</p>

								<p className='font-bold text-forest'>
									Birlik narxi: {selectedProduct.price.toLocaleString()} so'm
								</p>
							</div>
							<div className='space-y-2'>
								<Label>Miqdor</Label>
								<div className='flex items-center space-x-2'>
									<Button
										size='sm'
										variant='outline'
										onClick={() => handleQuantityChange(-1)}
										disabled={quantity <= 1}
									>
										<Minus className='w-4 h-4' />
									</Button>
									<Input
										type='number'
										value={quantity}
										onChange={e => {
											const value = parseInt(e.target.value)
											if (
												!isNaN(value) &&
												value >= 1 &&
												value <= (selectedProduct.stock || 1)
											) {
												setQuantity(value)
											}
										}}
										className='w-16 text-center'
									/>
									<Button
										size='sm'
										variant='outline'
										onClick={() => handleQuantityChange(1)}
										disabled={quantity >= (selectedProduct.stock || 1)}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>
							</div>
							<div className='flex justify-between items-center'>
								<span className='font-medium text-forest'>Umumiy narx:</span>
								<span className='text-2xl font-bold text-forest'>
									{(selectedProduct.price * quantity).toLocaleString()} so'm
								</span>
							</div>
							<div className='flex space-x-2 justify-start'>
								<Button
									className='bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest'
									onClick={handleOrderSubmit}
								>
									Buyurtma berish
								</Button>
								<Button
									variant='outline'
									onClick={() => {
										setShowOrderDialog(false)
										setQuantity(1)
									}}
								>
									Bekor qilish
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default BrowseTab
