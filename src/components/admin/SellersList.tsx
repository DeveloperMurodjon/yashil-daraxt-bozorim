import { useEffect, useState } from 'react'
import { deleteSeller, getAllSellers, deleteProduct } from '@/services/admin'
import { SellerT, Product } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import * as Dialog from '@radix-ui/react-dialog'
import { Card, CardContent } from '@/components/ui/card'

export default function SellersList() {
	const [sellers, setSellers] = useState<SellerT[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const [selectedSeller, setSelectedSeller] = useState<SellerT | null>(null)
	const [openModal, setOpenModal] = useState(false)
	const [productLoading, setProductLoading] = useState<{
		[key: number]: boolean
	}>({})

	useEffect(() => {
		setLoading(true)
		getAllSellers()
			.then(data => {
				setSellers(data)
				setLoading(false)
			})
			.catch(err => {
				setError(true)
				toast.error(
					err.response?.data?.error?.message || 'Sotuvchilarni olishda xatolik',
					{
						icon: <AlertCircle className='w-5 h-5 text-red-500' />,
					}
				)
				setLoading(false)
			})
	}, [])

	const handleDeleteSeller = async (id: number) => {
		if (!confirm('Haqiqatan sotuvchini o`chirishni xohlaysizmi?')) return
		try {
			await deleteSeller(id)
			setSellers(prev => prev.filter(s => s.id !== id))
			toast.success('Sotuvchi muvaffaqiyatli o`chirildi', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
		} catch (err) {
			toast.error(err.response?.data?.error?.message || 'O`chirishda xatolik', {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
		}
	}

	const handleDeleteProduct = async (productId: number, sellerId: number) => {
		if (!confirm('Haqiqatan mahsulotni o`chirishni xohlaysizmi?')) return
		try {
			setProductLoading(prev => ({ ...prev, [productId]: true }))
			await deleteProduct(productId)
			setSellers(prev =>
				prev.map(seller => {
					if (seller.id === sellerId) {
						return {
							...seller,
							products: seller.products?.filter(p => p.id !== productId) || [],
						}
					}
					return seller
				})
			)
			toast.success('Mahsulot muvaffaqiyatli o`chirildi', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
		} catch (err) {
			toast.error(
				err.response?.data?.error?.message || 'Mahsulotni o`chirishda xatolik',
				{
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				}
			)
		} finally {
			setProductLoading(prev => ({ ...prev, [productId]: false }))
		}
	}

	const handleViewProducts = (seller: SellerT) => {
		setSelectedSeller(seller)
		setOpenModal(true)
	}

	return (
		<div className='min-h-screen bg-muted p-4 sm:p-6'>
			<div className='w-full mx-auto space-y-6 max-w-7xl'>
				<h1 className='text-lg sm:text-2xl md:text-3xl font-bold text-forest text-center'>
					Sotuvchilar ro`yxati
				</h1>
				{loading ? (
					<p className='text-center text-forest text-sm sm:text-lg'>
						Ma`lumotlar yuklanmoqda...
					</p>
				) : error ? (
					<p className='text-center text-red-500 text-sm sm:text-lg'>
						Sotuvchilar topilmadi
					</p>
				) : sellers.length === 0 ? (
					<p className='text-center text-forest text-sm sm:text-lg'>
						Sotuvchilar mavjud emas
					</p>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full bg-white rounded-lg shadow-md border border-forest/20'>
							<thead>
								<tr className='bg-sage/20 text-forest text-left text-xs sm:text-sm'>
									<th className='p-2 sm:p-3'>#</th>
									<th className='p-2 sm:p-3'>Ism</th>
									<th className='p-2 sm:p-3'>Email</th>
									<th className='p-2 sm:p-3'>Telefon</th>
									<th className='p-2 sm:p-3'>Biznes nomi</th>
									<th className='p-2 sm:p-3'>Manzil</th>
									<th className='p-2 sm:p-3'>Tajriba</th>
									<th className='p-2 sm:p-3'>Amallar</th>
								</tr>
							</thead>
							<tbody>
								{sellers.map((s, i) => (
									<tr
										key={s.id}
										className='border-t border-forest/20 text-xs sm:text-sm hover:bg-sage/10 cursor-pointer'
										onClick={() => handleViewProducts(s)}
									>
										<td className='p-2 sm:p-3'>{i + 1}</td>
										<td className='p-2 sm:p-3'>{s.fullName}</td>
										<td className='p-2 sm:p-3'>{s.email}</td>
										<td className='p-2 sm:p-3'>{s.phone}</td>
										<td className='p-2 sm:p-3'>{s.businessName}</td>
										<td className='p-2 sm:p-3'>{s.addres}</td>
										<td className='p-2 sm:p-3'>{s.experience}</td>
										<td className='p-2 sm:p-3'>
											<Button
												onClick={e => {
													e.stopPropagation()
													handleDeleteSeller(s.id!)
												}}
												className='bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm'
												size='sm'
											>
												<Trash2 className='w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2' />
												O`chirish
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Modal */}
			<Dialog.Root open={openModal} onOpenChange={setOpenModal}>
				<Dialog.Portal>
					<Dialog.Overlay className='fixed inset-0 bg-black/50' />
					<Dialog.Content className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 max-w-7xl w-full max-h-[90vh] overflow-y-auto'>
						<Dialog.Title className='text-forest text-xl font-bold'>
							{selectedSeller?.fullName}ning mahsulotlari
						</Dialog.Title>
						<Dialog.Description className='text-muted-foreground mb-4'>
							Ushbu sotuvchi tomonidan qo`shilgan mahsulotlar ro`yxati
						</Dialog.Description>
						{selectedSeller &&
						selectedSeller.products &&
						selectedSeller.products.length > 0 ? (
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
								{selectedSeller.products.map((product: Product) => (
									<Card key={product.id} className='shadow-card'>
										<CardContent className='p-4'>
											<div className='aspect-square bg-sage/30 rounded-lg mb-4 flex items-center justify-center'>
												<img
													src={
														product.images?.[0]?.ImageUrl ||
														'/placeholder-tree.jpg'
													}
													alt={product.name}
													className='w-full h-full object-cover rounded-lg'
													onError={e => {
														e.currentTarget.src = '/placeholder-tree.jpg'
													}}
												/>
											</div>
											<div className='space-y-2'>
												<h3 className='font-medium text-forest'>
													{product.name}
												</h3>
												<p className='text-sm text-muted-foreground'>
													Narxi: {product.price.toLocaleString()} so'm
												</p>
												<p className='text-sm text-muted-foreground'>
													Yetkazib berish:{' '}
													{product.deliveryService === 'yes'
														? 'Mavjud'
														: 'Mavjud emas'}
												</p>
												<p className='text-sm text-muted-foreground'>
													Omborda: {product.stock} dona
												</p>
												<p className='text-sm text-muted-foreground'>
													Balandlik: {product.height} m
												</p>
												<p className='text-sm text-muted-foreground'>
													Yosh: {product.age} yil
												</p>
												<p className='text-sm text-muted-foreground'>
													Hudud: {product.region}
												</p>
											</div>
											<Button
												onClick={() =>
													handleDeleteProduct(product.id, selectedSeller.id!)
												}
												className='mt-4 bg-red-500 hover:bg-red-600 text-white w-full'
												size='sm'
												disabled={productLoading[product.id]}
											>
												{productLoading[product.id] ? (
													<span className='animate-spin mr-2'>⏳</span>
												) : (
													<Trash2 className='w-4 h-4 mr-2' />
												)}
												O`chirish
											</Button>
										</CardContent>
									</Card>
								))}
							</div>
						) : (
							<p className='text-center text-forest text-sm sm:text-lg'>
								Ushbu sotuvchiga tegishli mahsulotlar mavjud emas
							</p>
						)}
						<div className='flex justify-end mt-6'>
							<Dialog.Close asChild>
								<Button variant='outline'>Yopish</Button>
							</Dialog.Close>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	)
}
