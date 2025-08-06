import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Edit, Eye, Trash2 } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { Product } from '@/types/types'

interface MyProductsProps {
	products: Product[]
	showViewProduct: boolean
	setShowViewProduct: React.Dispatch<React.SetStateAction<boolean>>
	viewingProduct: Product | null
	handleEdit: (product: Product) => void
	handleView: (product: Product) => void
	handleDelete: (productId: number) => void
}

const MyProducts: React.FC<MyProductsProps> = ({
	products,
	showViewProduct,
	setShowViewProduct,
	viewingProduct,
	handleEdit,
	handleView,
	handleDelete,
}) => {
	return (
		<>
			<Dialog.Root open={showViewProduct} onOpenChange={setShowViewProduct}>
				<Dialog.Portal>
					<Dialog.Overlay className='fixed inset-0 bg-black/50' />
					<Dialog.Content className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto'>
						<Dialog.Title className='text-forest text-xl font-bold'>
							Mahsulot Ma'lumotlari
						</Dialog.Title>
						<Dialog.Description className='text-muted-foreground mb-4'>
							Mahsulot haqida to'liq ma'lumot
						</Dialog.Description>
						{viewingProduct && (
							<div className='space-y-4'>
								<div>
									<Label className='text-forest'>Nomi</Label>
									<p className='text-muted-foreground'>{viewingProduct.name}</p>
								</div>
								<div>
									<Label className='text-forest'>Narxi</Label>
									<p className='text-muted-foreground'>
										{viewingProduct.price.toLocaleString()} so'm
									</p>
								</div>
								<div>
									<Label className='text-forest'>Yetkazib berish xizmati</Label>
									<p className='text-muted-foreground'>
										{viewingProduct.deliveryService === 'yes'
											? 'Mavjud'
											: 'Mavjud emas'}
									</p>
								</div>
								<div>
									<Label className='text-forest'>Miqdori</Label>
									<p className='text-muted-foreground'>
										{viewingProduct.stock} dona
									</p>
								</div>
								<div>
									<Label className='text-forest'>Balandlik</Label>
									<p className='text-muted-foreground'>
										{viewingProduct.height} m
									</p>
								</div>
								<div>
									<Label className='text-forest'>Yosh</Label>
									<p className='text-muted-foreground'>
										{viewingProduct.age} yil
									</p>
								</div>
								<div>
									<Label className='text-forest'>Hudud</Label>
									<p className='text-muted-foreground'>
										{viewingProduct.region}
									</p>
								</div>
								<div>
									<Label className='text-forest'>Kategoriya</Label>
									<p className='text-muted-foreground'>
										{viewingProduct.category.name}
									</p>
								</div>
								<div>
									<Label className='text-forest'>Sotuvchi</Label>
									<p className='text-muted-foreground'>
										{viewingProduct.saller.businessName}
									</p>
									<p className='text-muted-foreground'>
										{viewingProduct.saller.phone}
									</p>
								</div>
								<div>
									<Label className='text-forest'>Rasm</Label>
									{viewingProduct.images?.[0]?.ImageUrl ? (
										<img
											src={viewingProduct.images[0].ImageUrl}
											alt={viewingProduct.name}
											className='w-32 h-32 object-cover rounded-lg mt-2'
											onError={e => {
												e.currentTarget.src = ''
											}}
										/>
									) : (
										<p className='text-muted-foreground'>Rasm mavjud emas</p>
									)}
								</div>
								<Dialog.Close asChild>
									<Button variant='outline' className='w-full'>
										Yopish
									</Button>
								</Dialog.Close>
							</div>
						)}
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{products.length === 0 ? (
					<div className='text-center p-4 text-muted-foreground'>
						Mahsulotlar topilmadi
					</div>
				) : (
					products.map(product => (
						<Card key={product.id} className='shadow-card'>
							<CardContent className='p-4'>
								<div className='aspect-square bg-sage/30 rounded-lg mb-4 flex items-center justify-center'>
									<img
										src={
											product.images?.[0]?.ImageUrl || '/placeholder-tree.jpg'
										}
										alt={product.name}
										className='w-full h-full object-cover rounded-lg'
										onError={e => {
											e.currentTarget.src = ''
										}}
									/>
								</div>
								<div className='space-y-2'>
									<h3 className='font-medium text-forest'>{product.name}</h3>
									<p className='text-sm text-muted-foreground'>
										{product.category.name}
									</p>
									<div className='flex justify-between items-center'>
										<span className='font-bold text-forest'>
											{product.price.toLocaleString()} so'm
										</span>
										<Badge
											variant={product.stock > 0 ? 'default' : 'secondary'}
										>
											{product.stock > 0 ? 'Faol' : 'Tugagan'}
										</Badge>
									</div>
									<p className='text-sm text-muted-foreground'>
										Omborda: {product.stock} dona
									</p>
								</div>
								<div className='flex space-x-2 mt-4'>
									<Button
										size='sm'
										variant='outline'
										className='flex-1'
										onClick={() => handleEdit(product)}
									>
										<Edit className='w-4 h-4 mr-1' />
										Tahrirlash
									</Button>
									<Button
										size='sm'
										variant='outline'
										className='flex-1'
										onClick={() => handleView(product)}
									>
										<Eye className='w-4 h-4 mr-1' />
										Ko`rish
									</Button>
									<Button
										size='sm'
										variant='destructive'
										className='flex-1'
										onClick={() => handleDelete(product.id)}
									>
										<Trash2 className='w-4 h-4 mr-1' />
										O`chirish
									</Button>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</>
	)
}

export default MyProducts
