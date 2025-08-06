import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
	Heart,
	MapPin,
	Phone,
	ShoppingCart,
	Eye,
	CheckCircle,
	AlertCircle,
	Minus,
	Plus,
} from 'lucide-react'
import { toast } from 'react-toastify'
import {
	getUserFavorites,
	toggleLike,
	createOrder,
} from '@/services/productService'
import { Favorite, LikeResponse } from '@/services/productService'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { UserProfile } from '@/types/types'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

interface FavoritesTabProps {
	user: UserProfile
	setUser: React.Dispatch<React.SetStateAction<UserProfile>>
}

const FavoritesTab: React.FC<FavoritesTabProps> = ({ user }) => {
	const [favorites, setFavorites] = useState<Favorite[]>([])
	const [loading, setLoading] = useState(true)
	const [showOrderDialog, setShowOrderDialog] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState<Favorite | null>(null)
	const [quantity, setQuantity] = useState(1)

	useEffect(() => {
		const fetchFavorites = async () => {
			try {
				setLoading(true)
				const token = localStorage.getItem('access_token')
				if (!token) {
					toast.error('Tizimga kirish talab qilinadi')
					return
				}
				const data = await getUserFavorites()
				console.log('Favorites response:', data)
				setFavorites(data)
				setLoading(false)
			} catch (error) {
				console.error('Sevimlilarni yuklashda xatolik:', {
					message: error.message,
					response: error.response?.data,
					status: error.response?.status,
				})
				toast.error(
					error.response?.data?.message ||
						'Sevimlilarni yuklashda xatolik yuz berdi',
					{
						icon: <AlertCircle className='w-5 h-5 text-red-500' />,
					}
				)
				setLoading(false)
			}
		}
		fetchFavorites()
	}, [])

	const handleToggleLike = async (productId: number) => {
		try {
			const response: LikeResponse = await toggleLike(productId)
			toast.success(response.message)
			if (!response.liked) {
				setFavorites(favorites.filter(fav => fav.product.id !== productId))
			} else {
				const data = await getUserFavorites()
				setFavorites(data)
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
				productId: selectedProduct.product.id,
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
				: newQuantity > (selectedProduct?.product.stock || 1)
				? selectedProduct?.product.stock || 1
				: newQuantity
		})
	}

	const handleContactSeller = (phone: string) => {
		window.location.href = `tel:${phone}`
	}

	if (loading) {
		return <div className='text-center p-4'>Yuklanmoqda...</div>
	}

	return (
		<div className='space-y-6'>
			<h2 className='text-2xl font-bold text-forest'>Sevimli Mahsulotlar</h2>
			{favorites.length === 0 ? (
				<p className='text-center text-muted-foreground'>
					Sevimli mahsulotlar topilmadi
				</p>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{favorites.map(fav => (
						<Card
							key={fav.id}
							className='shadow-card hover:shadow-nature transition-shadow duration-300'
						>
							<CardContent className='p-0'>
								{/* <div className='aspect-square bg-sage/30 rounded-t-lg flex items-center justify-center'>
									<img
										src={
											fav.product..[0]?.ImageUrl ||
											'/placeholder-tree.jpg'
										}
										alt={fav.product.name}
										className='w-full h-full object-cover rounded-t-lg'
									/>
								</div> */}

								<div className='p-4 space-y-3'>
									<div className='flex justify-between items-start'>
										<h3 className='font-semibold text-forest'>
											{fav.product.name}
										</h3>
										<Button
											size='sm'
											variant='ghost'
											className='p-1'
											onClick={() => handleToggleLike(fav.product.id)}
										>
											<Heart className='w-4 h-4 fill-red-500 text-red-500' />
										</Button>
									</div>

									<div className='space-y-2 text-sm'>
										<p className='font-medium text-forest'>
											Manzil: {fav.product.region}
										</p>
										<p className='font-bold text-forest'>
											Narxi: {fav.product.price.toLocaleString()} so'm
										</p>
										<p className='text-muted-foreground'>
											Umumiy soni: {fav.product.stock} dona
										</p>
										<p className='text-muted-foreground'>
											Balandligi: {fav.product.height}m, Yoshi:{' '}
											{fav.product.age} yil
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
														{fav.product.name}
													</DialogTitle>
												</DialogHeader>
												<div className='space-y-4'>
													{/* <div className='aspect-video bg-sage/30 rounded-lg flex items-center justify-center'>
														<img
															src={
																fav.product.images?.[0]?.ImageUrl ||
																'/placeholder-tree.jpg'
															}
															alt={fav.product.name}
															className='w-full h-full object-cover rounded-lg'
														/>
													</div> */}

													<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
														<div className='space-y-4'>
															<div>
																<h4 className='font-semibold text-forest mb-2'>
																	Mahsulot haqida
																</h4>
																<p className='text-muted-foreground'>
																	Balandligi: {fav.product.height}m, Yoshi:{' '}
																	{fav.product.age} yil
																</p>
																<p className='text-muted-foreground'>
																	Yetkazib berish: {fav.product.deliveryService}
																</p>
															</div>
														</div>

														<div className='space-y-4'>
															<div>
																<h4 className='font-semibold text-forest mb-2'>
																	Ma`lumot
																</h4>
																<div className='space-y-2'>
																	<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
																		<MapPin className='w-4 h-4' />
																		<span>{fav.product.region}</span>
																	</div>
																</div>
															</div>

															<div className='space-y-3'>
																<div className='flex justify-between items-center'>
																	<span className='text-2xl font-bold text-forest'>
																		{fav.product.price.toLocaleString()} so'm
																	</span>
																	<Badge
																		variant={
																			fav.product.stock > 0
																				? 'default'
																				: 'secondary'
																		}
																	>
																		{fav.product.stock > 0
																			? `${fav.product.stock} dona mavjud`
																			: 'Tugagan'}
																	</Badge>
																</div>

																<div className='space-y-2'>
																	<Button
																		className='w-full bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest'
																		disabled={fav.product.stock === 0}
																		onClick={() => {
																			setSelectedProduct(fav)
																			setShowOrderDialog(true)
																		}}
																	>
																		<ShoppingCart className='w-4 h-4 mr-2' />
																		Buyurtma berish
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
											disabled={fav.product.stock === 0}
											onClick={() => {
												setSelectedProduct(fav)
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
					))}
				</div>
			)}

			<Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
				<DialogContent className='max-w-xl'>
					<DialogHeader>
						<DialogTitle className='text-forest'>Buyurtma berish</DialogTitle>
					</DialogHeader>
					{selectedProduct && (
						<div className='space-y-4'>
							<div className='p-4 bg-sage/30 rounded-lg'>
								<h4 className='font-medium text-forest'>
									{selectedProduct.product.name}
								</h4>
								<p className='text-sm text-muted-foreground'>
									Manzil: {selectedProduct.product.region}
								</p>
								<p className='text-sm text-muted-foreground'>
									Balandligi: {selectedProduct.product.height}m, Yoshi:{' '}
									{selectedProduct.product.age} yil
								</p>
								<p className='text-sm text-muted-foreground'>
									Yetkazib berish: {selectedProduct.product.deliveryService}
								</p>
								<p className='font-bold text-forest'>
									Birlik narxi: {selectedProduct.product.price.toLocaleString()}{' '}
									so'm
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
												value <= (selectedProduct.product.stock || 1)
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
										disabled={quantity >= (selectedProduct.product.stock || 1)}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>
							</div>
							<div className='flex justify-between items-center'>
								<span className='font-medium text-forest'>Umumiy narx:</span>
								<span className='text-2xl font-bold text-forest'>
									{(selectedProduct.product.price * quantity).toLocaleString()}{' '}
									so'm
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

export default FavoritesTab
