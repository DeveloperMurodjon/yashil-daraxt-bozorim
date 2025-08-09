import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Pencil, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { updateProduct, getMyProducts } from '@/services/productService'
import { Product } from '@/types/types'
import * as Dialog from '@radix-ui/react-dialog'

interface UpdateProductProps {
	showEditProduct: boolean
	setShowEditProduct: React.Dispatch<React.SetStateAction<boolean>>
	editingProduct: Product | null
	formData: {
		name: string
		price: string
		deliveryService: string
		stock: string
		height: string
		age: string
		region: string
		categoryId: string
		imagePreview: string | null
	}
	setFormData: React.Dispatch<
		React.SetStateAction<{
			name: string
			price: string
			deliveryService: string
			stock: string
			height: string
			age: string
			region: string
			categoryId: string
			imagePreview: string | null
		}>
	>
	editableFields: {
		name: boolean
		price: boolean
		deliveryService: boolean
		stock: boolean
		height: boolean
		age: boolean
		region: boolean
		categoryId: boolean
		images: boolean
	}
	setEditableFields: React.Dispatch<
		React.SetStateAction<{
			name: boolean
			price: boolean
			deliveryService: boolean
			stock: boolean
			height: boolean
			age: boolean
			region: boolean
			categoryId: boolean
			images: boolean
		}>
	>
	setProducts: React.Dispatch<React.SetStateAction<Product[]>>
	handleCancel: () => void
}

const UpdateProduct: React.FC<UpdateProductProps> = ({
	showEditProduct,
	setShowEditProduct,
	editingProduct,
	formData,
	setFormData,
	editableFields,
	setEditableFields,
	setProducts,
	handleCancel,
}) => {
	const [loading, setLoading] = useState<{ [key: string]: boolean }>({}) // Har bir maydon uchun loading holati

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files && files.length > 0) {
			const file = files[0]
			const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
			if (!allowedTypes.includes(file.type)) {
				toast.error('Faqat JPG, PNG yoki GIF rasmlarni yuklash mumkin', {
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				})
				return
			}
			const previewUrl = URL.createObjectURL(file)
			setFormData({ ...formData, imagePreview: previewUrl })
			setEditableFields({ ...editableFields, images: true })
		}
	}

	const toggleEditField = (field: keyof typeof editableFields) => {
		setEditableFields({ ...editableFields, [field]: !editableFields[field] })
	}

	const handleFieldSave = async (field: keyof typeof editableFields) => {
		try {
			if (!editingProduct) {
				toast.error('Tahrirlanayotgan mahsulot topilmadi', {
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				})
				return
			}

			setLoading(prev => ({ ...prev, [field]: true })) // Loading holatini yoqish

			const data = new FormData()
			switch (field) {
				case 'name':
					data.append('name', formData.name)
					break
				case 'price':
					data.append('price', formData.price)
					break
				case 'deliveryService':
					data.append('deliveryService', formData.deliveryService)
					break
				case 'stock':
					data.append('stock', formData.stock)
					break
				case 'height':
					data.append('height', formData.height)
					break
				case 'age':
					data.append('age', formData.age)
					break
				case 'region':
					data.append('region', formData.region)
					break
				case 'categoryId':
					data.append('categoryId', formData.categoryId)
					break
				case 'images': {
					const fileInput = document.querySelector(
						'input[name="images"]'
					) as HTMLInputElement
					if (fileInput?.files?.length) {
						const file = fileInput.files[0]
						const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
						if (!allowedTypes.includes(file.type)) {
							toast.error('Faqat JPG, PNG yoki GIF rasmlarni yuklash mumkin', {
								icon: <AlertCircle className='w-5 h-5 text-red-500' />,
							})
							setLoading(prev => ({ ...prev, [field]: false }))
							return
						}
						data.append('images', file)
					}
					break
				}
				default:
					setLoading(prev => ({ ...prev, [field]: false }))
					return
			}

			await updateProduct(editingProduct.id, data)
			toast.success(`${field} muvaffaqiyatli yangilandi`, {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})
			setEditableFields({ ...editableFields, [field]: false })
			setShowEditProduct(false) // Modalni yopish
			const updatedProducts = await getMyProducts()
			setProducts(updatedProducts)
		} catch (error) {
			toast.error(`${field} yangilashda xatolik`, {
				icon: <AlertCircle className='w-5 h-5 text-red-500' />,
			})
		} finally {
			setLoading(prev => ({ ...prev, [field]: false })) // Loading holatini o'chirish
		}
	}

	return (
		<Dialog.Root open={showEditProduct} onOpenChange={setShowEditProduct}>
			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 bg-black/50' />
				<Dialog.Content className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto'>
					<Dialog.Title className='text-forest text-xl font-bold'>
						Mahsulotni Tahrirlash
					</Dialog.Title>
					<Dialog.Description className='text-muted-foreground mb-4'>
						Mahsulot ma'lumotlarini yangilang
					</Dialog.Description>
					<div className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2 flex items-end'>
								<div className='flex-1'>
									<Label htmlFor='product-name'>Mahsulot nomi</Label>
									{editableFields.name ? (
										<Input
											id='product-name'
											name='name'
											value={formData.name}
											onChange={handleInputChange}
											placeholder="Masalan: Olma daraxti ko'chati"
										/>
									) : (
										<Input
											id='product-name'
											name='name'
											value={formData.name}
											readOnly
											className='bg-gray-100'
										/>
									)}
								</div>
								<div className='flex space-x-2 ml-2'>
									{editableFields.name ? (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => handleFieldSave('name')}
											disabled={loading.name}
											className='ml-2'
										>
											{loading.name ? (
												<span className='animate-spin mr-2'>⏳</span>
											) : null}
											Saqlash
										</Button>
									) : (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => toggleEditField('name')}
											className='ml-2'
										>
											<Pencil className='w-4 h-4' />
										</Button>
									)}
								</div>
							</div>
							<div className='space-y-2 flex items-end'>
								<div className='flex-1'>
									<Label htmlFor='product-price'>Narxi (so'm)</Label>
									{editableFields.price ? (
										<Input
											id='product-price'
											name='price'
											type='number'
											value={formData.price}
											onChange={handleInputChange}
											placeholder='0'
										/>
									) : (
										<Input
											id='product-price'
											name='price'
											value={formData.price}
											readOnly
											className='bg-gray-100'
										/>
									)}
								</div>
								<div className='flex space-x-2 ml-2'>
									{editableFields.price ? (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => handleFieldSave('price')}
											disabled={loading.price}
										>
											{loading.price ? (
												<span className='animate-spin mr-2'>⏳</span>
											) : null}
											Saqlash
										</Button>
									) : (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => toggleEditField('price')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									)}
								</div>
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2 flex items-end'>
								<div className='flex-1'>
									<Label htmlFor='product-deliveryService'>
										Yetkazib berish xizmati
									</Label>
									{editableFields.deliveryService ? (
										<select
											id='product-deliveryService'
											name='deliveryService'
											value={formData.deliveryService}
											onChange={handleInputChange}
											className='w-full p-2 border border-border rounded-md bg-background text-forest focus:outline-none focus:ring-2 focus:ring-forest/50'
										>
											<option value='yes'>Mavjud</option>
											<option value='no'>Mavjud emas</option>
										</select>
									) : (
										<Input
											id='product-deliveryService'
											name='deliveryService'
											value={
												formData.deliveryService === 'yes'
													? 'Mavjud'
													: 'Mavjud emas'
											}
											readOnly
											className='bg-gray-100'
										/>
									)}
								</div>
								<div className='flex space-x-2 ml-2'>
									{editableFields.deliveryService ? (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => handleFieldSave('deliveryService')}
											disabled={loading.deliveryService}
										>
											{loading.deliveryService ? (
												<span className='animate-spin mr-2'>⏳</span>
											) : null}
											Saqlash
										</Button>
									) : (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => toggleEditField('deliveryService')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									)}
								</div>
							</div>
							<div className='space-y-2 flex items-end'>
								<div className='flex-1'>
									<Label htmlFor='product-stock'>Miqdori</Label>
									{editableFields.stock ? (
										<Input
											id='product-stock'
											name='stock'
											type='number'
											value={formData.stock}
											onChange={handleInputChange}
											placeholder='0'
										/>
									) : (
										<Input
											id='product-stock'
											name='stock'
											value={formData.stock}
											readOnly
											className='bg-gray-100'
										/>
									)}
								</div>
								<div className='flex space-x-2 ml-2'>
									{editableFields.stock ? (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => handleFieldSave('stock')}
											disabled={loading.stock}
										>
											{loading.stock ? (
												<span className='animate-spin mr-2'>⏳</span>
											) : null}
											Saqlash
										</Button>
									) : (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => toggleEditField('stock')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									)}
								</div>
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2 flex items-end'>
								<div className='flex-1'>
									<Label htmlFor='product-height'>Balandlik</Label>
									{editableFields.height ? (
										<Input
											id='product-height'
											name='height'
											type='number'
											value={formData.height}
											onChange={handleInputChange}
											placeholder='0'
										/>
									) : (
										<Input
											id='product-height'
											name='height'
											value={formData.height}
											readOnly
											className='bg-gray-100'
										/>
									)}
								</div>
								<div className='flex space-x-2 ml-2'>
									{editableFields.height ? (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => handleFieldSave('height')}
											disabled={loading.height}
										>
											{loading.height ? (
												<span className='animate-spin mr-2'>⏳</span>
											) : null}
											Saqlash
										</Button>
									) : (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => toggleEditField('height')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									)}
								</div>
							</div>
							<div className='space-y-2 flex items-end'>
								<div className='flex-1'>
									<Label htmlFor='product-age'>Yosh</Label>
									{editableFields.age ? (
										<Input
											id='product-age'
											name='age'
											type='number'
											value={formData.age}
											onChange={handleInputChange}
											placeholder='0'
										/>
									) : (
										<Input
											id='product-age'
											name='age'
											value={formData.age}
											readOnly
											className='bg-gray-100'
										/>
									)}
								</div>
								<div className='flex space-x-2 ml-2'>
									{editableFields.age ? (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => handleFieldSave('age')}
											disabled={loading.age}
										>
											{loading.age ? (
												<span className='animate-spin mr-2'>⏳</span>
											) : null}
											Saqlash
										</Button>
									) : (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => toggleEditField('age')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									)}
								</div>
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2 flex items-end'>
								<div className='flex-1'>
									<Label htmlFor='product-region'>Hudud</Label>
									{editableFields.region ? (
										<Input
											id='product-region'
											name='region'
											value={formData.region}
											onChange={handleInputChange}
											placeholder='Masalan: Toshkent'
										/>
									) : (
										<Input
											id='product-region'
											name='region'
											value={formData.region}
											readOnly
											className='bg-gray-100'
										/>
									)}
								</div>
								<div className='flex space-x-2 ml-2'>
									{editableFields.region ? (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => handleFieldSave('region')}
											disabled={loading.region}
										>
											{loading.region ? (
												<span className='animate-spin mr-2'>⏳</span>
											) : null}
											Saqlash
										</Button>
									) : (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => toggleEditField('region')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									)}
								</div>
							</div>
							<div className='space-y-2 flex items-end'>
								<div className='flex-1'>
									<Label htmlFor='product-categoryId'>Kategoriya</Label>
									{editableFields.categoryId ? (
										<select
											id='product-categoryId'
											name='categoryId'
											value={formData.categoryId}
											onChange={handleInputChange}
											className='w-full p-2 border border-border rounded-md bg-background text-forest focus:outline-none focus:ring-2 focus:ring-forest/50'
										>
											<option value='1'>Meva ko‘chat</option>
											<option value='2'>Manzarali daraxt ko'chat</option>
											<option value='3'>Ignabargli daraxt ko'chat</option>
										</select>
									) : (
										<Input
											id='product-categoryId'
											name='categoryId'
											value={
												formData.categoryId === '1'
													? 'Meva ko‘chat'
													: formData.categoryId === '2'
													? 'Manzarali daraxt ko‘chat'
													: 'Ignabargli daraxt ko‘chat'
											}
											readOnly
											className='bg-gray-100'
										/>
									)}
								</div>
								<div className='flex space-x-2 ml-2'>
									{editableFields.categoryId ? (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => handleFieldSave('categoryId')}
											disabled={loading.categoryId}
										>
											{loading.categoryId ? (
												<span className='animate-spin mr-2'>⏳</span>
											) : null}
											Saqlash
										</Button>
									) : (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => toggleEditField('categoryId')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									)}
								</div>
							</div>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='product-images'>Rasm</Label>
							<div className='border-2 border-dashed border-border rounded-lg p-6 text-center'>
								{formData.imagePreview ? (
									<img
										src={formData.imagePreview}
										alt='Preview'
										className='w-32 h-32 object-cover mx-auto mb-2 rounded-lg'
									/>
								) : (
									<Upload className='w-8 h-8 mx-auto text-muted-foreground mb-2' />
								)}
								{editableFields.images && (
									<>
										<p className='text-muted-foreground'>
											{formData.imagePreview
												? 'Boshqa rasm yuklash uchun bosing'
												: 'Rasm yuklash uchun bosing yoki sudrab tashlang'}
										</p>
										<input
											type='file'
											id='product-images'
											name='images'
											onChange={handleFileChange}
											accept='image/jpeg,image/png,image/gif'
											className='hidden'
										/>
										<label htmlFor='product-images'>
											<Button variant='outline' className='mt-2' asChild>
												<span>Fayl tanlash</span>
											</Button>
										</label>
									</>
								)}
								<div className='flex justify-center space-x-2 mt-2'>
									{editableFields.images ? (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => handleFieldSave('images')}
											disabled={loading.images}
										>
											{loading.images ? (
												<span className='animate-spin mr-2'>⏳</span>
											) : null}
											Saqlash
										</Button>
									) : (
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => toggleEditField('images')}
										>
											<Pencil className='w-4 h-4' />
										</Button>
									)}
								</div>
							</div>
						</div>
						<div className='flex space-x-4'>
							<Dialog.Close asChild>
								<Button variant='outline' onClick={handleCancel}>
									Bekor qilish
								</Button>
							</Dialog.Close>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

export default UpdateProduct
