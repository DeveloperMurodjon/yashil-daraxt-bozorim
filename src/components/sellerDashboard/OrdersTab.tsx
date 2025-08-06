import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Eye } from 'lucide-react'
import { toast } from 'react-toastify'
import { getMyOrders } from '@/services/productService'
import { Order } from '@/types/types'
import { AlertCircle } from 'lucide-react'

const OrdersTab: React.FC = () => {
	const [orders, setOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const data = await getMyOrders()
				setOrders(data)
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
														order.status === 'panding' ? 'secondary' : 'default'
													}
												>
													{order.status === 'panding'
														? 'Kutilmoqda'
														: 'Bajarildi'}
												</Badge>
											</td>
											<td className='p-4'>
												<div className='flex space-x-2'>
													<Button size='sm' variant='outline'>
														<MessageSquare className='w-4 h-4' />
													</Button>
													<Button size='sm' variant='outline'>
														<Eye className='w-4 h-4' />
													</Button>
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
		</div>
	)
}

export default OrdersTab
