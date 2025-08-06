import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Phone, Eye, AlertCircle } from 'lucide-react'
import { Order, UserProfile } from '@/types/types'
import { getUserOrders } from '@/services/productService'
import { toast } from 'react-toastify'

interface OrdersTabProps {
	user: UserProfile
	setUser: (user: UserProfile) => void
}

const OrdersTab = ({ user, setUser }) => {
	const [orders, setOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const data = await getUserOrders()
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
			<h2 className='text-2xl font-bold text-forest'>Buyurtmalarim</h2>
			<div className='space-y-4'>
				{orders.length === 0 ? (
					<p className='text-muted-foreground'>Hozircha buyurtmalar yo'q</p>
				) : (
					orders.map(order => (
						<Card key={order.id} className='shadow-card'>
							<CardContent className='p-6'>
								<div className='flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0'>
									<div className='space-y-2'>
										<div className='flex items-center space-x-4'>
											<h3 className='font-semibold text-forest'>
												{order.product.name}
											</h3>
											<Badge
												variant={
													order.status === 'panding' ? 'secondary' : 'default'
												}
											>
												{order.status === 'panding'
													? 'Kutilmoqda'
													: 'Bajarildi'}
											</Badge>
										</div>
										<p className='text-muted-foreground'>
											Miqdor: {order.quantity} dona
										</p>
										<div className='flex items-center space-x-4 text-sm text-muted-foreground'>
											<span>
												Sana: {new Date(order.createdAt).toLocaleDateString()}
											</span>
											<span>Manzil: {order.product.region}</span>
										</div>
									</div>

									<div className='text-right space-y-2'>
										<p className='text-xl font-bold text-forest'>
											{order.totalPrice.toLocaleString()} so'm
										</p>
										<div className='flex space-x-2'>
											<Button size='sm' variant='outline'>
												<Phone className='w-4 h-4 mr-1' />
												Xabar
											</Button>
											<Button size='sm' variant='outline'>
												<Eye className='w-4 h-4 mr-1' />
												Ko'rish
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	)
}

export default OrdersTab
