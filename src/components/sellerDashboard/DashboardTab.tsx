import React, { useState, useEffect } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Users, MessageSquare, TrendingUp } from 'lucide-react'
import { toast } from 'react-toastify'
import { getMyProducts, getMyOrders } from '@/services/productService'
import { Product, Order } from '@/types/types'

const DashboardTab: React.FC = () => {
	const [orders, setOrders] = useState<Order[]>([])
	const [products, setProducts] = useState<Product[]>([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [productsData, ordersData] = await Promise.all([
					getMyProducts(),
					getMyOrders(),
				])
				setProducts(productsData)
				setOrders(ordersData)
			} catch (error) {
				toast.error('Ma`lumotlarni yuklashda xatolik yuz berdi')
			}
		}
		fetchData()
	}, [])

	const stats = {
		totalProducts: products.length,
		totalOrders: orders.length,
		pendingOrders: orders.filter(order => order.status === 'panding').length,
		totalRevenue: orders
			.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0)
			.toLocaleString(),
	}

	return (
		<div className='space-y-6'>
			{/* Stats Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				<Card className='shadow-card'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-muted-foreground text-sm'>
									Jami Mahsulotlar
								</p>
								<p className='text-2xl font-bold text-forest'>
									{stats.totalProducts}
								</p>
							</div>
							<Package className='w-8 h-8 text-forest' />
						</div>
					</CardContent>
				</Card>

				<Card className='shadow-card'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-muted-foreground text-sm'>
									Jami Buyurtmalar
								</p>
								<p className='text-2xl font-bold text-forest'>
									{stats.totalOrders}
								</p>
							</div>
							<Users className='w-8 h-8 text-forest' />
						</div>
					</CardContent>
				</Card>

				<Card className='shadow-card'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-muted-foreground text-sm'>Kutilayotgan</p>
								<p className='text-2xl font-bold text-gold'>
									{stats.pendingOrders}
								</p>
							</div>
							<MessageSquare className='w-8 h-8 text-gold' />
						</div>
					</CardContent>
				</Card>

				<Card className='shadow-card'>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-muted-foreground text-sm'>Jami Daromad</p>
								<p className='text-2xl font-bold text-forest'>
									{stats.totalRevenue} so'm
								</p>
							</div>
							<TrendingUp className='w-8 h-8 text-forest' />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Orders */}
			<Card className='shadow-card'>
				<CardHeader>
					<CardTitle className='text-forest'>So'nggi Buyurtmalar</CardTitle>
					<CardDescription>Yangi kelgan buyurtmalar ro'yxati</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{orders.slice(0, 3).map(order => (
							<div
								key={order.id}
								className='flex items-center justify-between p-4 bg-sage/30 rounded-lg'
							>
								<div className='flex-1'>
									<p className='font-medium'>{order.product.name}</p>
									<p className='text-sm text-muted-foreground'>
										{order.user.id} • {order.quantity} dona
									</p>
								</div>
								<div className='text-right'>
									<p className='font-bold text-forest'>
										{order.totalPrice.toLocaleString()} so'm
									</p>
									<Badge
										variant={
											order.status === 'pending' ? 'secondary' : 'default'
										}
									>
										{order.status === 'pending' ? 'Kutilmoqda' : 'Bajarildi'}
									</Badge>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default DashboardTab
