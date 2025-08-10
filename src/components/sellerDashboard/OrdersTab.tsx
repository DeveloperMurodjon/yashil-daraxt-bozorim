import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Eye, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { getMyOrders, confirmOrder } from '@/services/productService'
import { Order } from '@/types/types'
import { AlertCircle } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

const OrdersTab: React.FC = () => {
	const [orders, setOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const data = await getMyOrders()
				// Buyurtmalarni createdAt bo'yicha teskari tartibda sorthlash
				const sortedOrders = data.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				)
				setOrders(sortedOrders)
			} catch (error) {
				toast.error('Buyurtmalarni yuklashda xatolik yuz berdi', {
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				})
			} finally {
				setLoading(false)
			}
		}
		fetchOrders()
	}, [])

	const handleConfirm = async (orderId: number) => {
		try {
			const updatedOrder = await confirmOrder(orderId, 'completed')
			setOrders(
				orders.map(order => (order.id === orderId ? updatedOrder : order))
			)
			toast.success('Buyurtma tasdiqlandi')
		} catch (error) {
			toast.error('Buyurtmani tasdiqlashda xatolik yuz berdi', {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
		}
	}

	const handleCancel = async (orderId: number) => {
		try {
			const updatedOrder = await confirmOrder(orderId, 'cancelled')
			setOrders(
				orders.map(order => (order.id === orderId ? updatedOrder : order))
			)
			toast.success('Buyurtma bekor qilindi')
		} catch (error) {
			toast.error('Buyurtmani bekor qilishda xatolik yuz berdi', {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
		}
	}

	if (loading) {
		return <div className='text-center p-4'>Yuklanmoqda...</div>
	}

	return (
		<div className='space-y-6'>
			<h2 className='text-2xl font-bold text-forest'>Buyurtmalar</h2>

			<Card className='shadow-card'>
				<CardContent className='p-0'>
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead className='bg-sage/30'>
								<tr>
									<th className='text-left p-4 font-medium'>Buyurtma</th>
									<th className='text-left p-4 font-medium'>Xaridor</th>
									<th className='text-left p-4 font-medium'>Miqdor</th>
									<th className='text-left p-4 font-medium'>Summa</th>
									<th className='text-left p-4 font-medium'>Sana</th>
									<th className='text-left p-4 font-medium'>Holat</th>
									<th className='text-left p-4 font-medium'>Amallar</th>
								</tr>
							</thead>
							<tbody>
								{orders.length === 0 ? (
									<tr>
										<td
											colSpan={7}
											className='p-4 text-center text-muted-foreground'
										>
											Buyurtmalar topilmadi
										</td>
									</tr>
								) : (
									orders.map(order => (
										<tr key={order.id} className='border-b'>
											<td className='p-4'>
												<div>
													<p className='font-medium'>{order.product.name}</p>
													<p className='text-sm text-muted-foreground'>
														#{order.id}
													</p>
												</div>
											</td>
											<td className='p-4'>
												<div>
													<p className='font-medium'>{order.user.fullName}</p>
													<p className='text-sm text-muted-foreground'>
														{order.user.phone}
													</p>
												</div>
											</td>
											<td className='p-4'>{order.quantity} dona</td>
											<td className='p-4 font-bold text-forest'>
												{parseFloat(order.totalPrice).toLocaleString()} so'm
											</td>
											<td className='p-4'>
												{new Date(order.createdAt).toLocaleDateString()}
											</td>
											<td className='p-4'>
												<Badge
													variant={
														order.status === 'panding'
															? 'secondary'
															: order.status === 'cancelled'
															? 'destructive'
															: 'default'
													}
												>
													{order.status === 'panding'
														? 'Kutilmoqda'
														: order.status === 'cancelled'
														? 'Bekor qilingan'
														: 'Bajarildi'}
												</Badge>
											</td>
											<td className='p-4'>
												<div className='flex space-x-2'>
													<Button size='sm' variant='outline'>
														<MessageSquare className='w-4 h-4' />
													</Button>
													<Button
														size='sm'
														variant='outline'
														onClick={() => setSelectedOrder(order)}
													>
														<Eye className='w-4 h-4' />
													</Button>
													{order.status === 'panding' && (
														<>
															<Button
																size='sm'
																variant='default'
																onClick={() => handleConfirm(order.id)}
															>
																Tasdiqlash
															</Button>
															<Button
																size='sm'
																variant='destructive'
																onClick={() => handleCancel(order.id)}
															>
																<X className='w-4 h-4 mr-1' />
																Bekor qilish
															</Button>
														</>
													)}
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			<Dialog
				open={!!selectedOrder}
				onOpenChange={() => setSelectedOrder(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Buyurtma tafsilotlari</DialogTitle>
					</DialogHeader>
					{selectedOrder && (
						<div className='space-y-4'>
							<p>
								<strong>Buyurtma ID:</strong> {selectedOrder.id}
							</p>
							<p>
								<strong>Mahsulot:</strong> {selectedOrder.product.name}
							</p>
							<p>
								<strong>Xaridor:</strong> {selectedOrder.user.fullName}
							</p>
							<p>
								<strong>Telefon:</strong> {selectedOrder.user.phone}
							</p>
							<p>
								<strong>Email:</strong> {selectedOrder.user.email}
							</p>
							<p>
								<strong>Miqdor:</strong> {selectedOrder.quantity} dona
							</p>
							<p>
								<strong>Summa:</strong>{' '}
								{parseFloat(selectedOrder.totalPrice).toLocaleString()} so'm
							</p>
							<p>
								<strong>Sana:</strong>{' '}
								{new Date(selectedOrder.createdAt).toLocaleString()}
							</p>
							<p>
								<strong>Holat:</strong>{' '}
								{selectedOrder.status === 'panding'
									? 'Kutilmoqda'
									: selectedOrder.status === 'cancelled'
									? 'Bekor qilingan'
									: 'Bajarildi'}
							</p>
							<div>
								<strong>Mahsulot tafsilotlari:</strong>
								<p>Balandligi: {selectedOrder.product.height} sm</p>
								<p>Yoshi: {selectedOrder.product.age} yil</p>
								<p>Hudud: {selectedOrder.product.region}</p>
								<p>Yetkazib berish: {selectedOrder.product.deliveryService}</p>
								<p>Ombordagi soni: {selectedOrder.product.stock}</p>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default OrdersTab
