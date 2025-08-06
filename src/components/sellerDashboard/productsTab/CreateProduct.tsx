import React from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { createProduct, getMyProducts } from '@/services/productService'
import { Product } from '@/types/types'

interface FormDataObject {
	[key: string]: string | File
}

interface CreateProductProps {
	showAddProduct: boolean
	setShowAddProduct: React.Dispatch<React.SetStateAction<boolean>>
	setShowEditProduct: React.Dispatch<React.SetStateAction<boolean>>
	setShowViewProduct: React.Dispatch<React.SetStateAction<boolean>>
	setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>
	setViewingProduct: React.Dispatch<React.SetStateAction<Product | null>>
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
}

const CreateProduct: React.FC<CreateProductProps> = ({
	showAddProduct,
	setShowAddProduct,
	setShowEditProduct,
	setShowViewProduct,
	setEditingProduct,
	setViewingProduct,
	formData,
	setFormData,
	editableFields,
	setEditableFields,
	setProducts,
}) => {
	const handleChange = (name: string, value: string | File) => {
		if (value instanceof File) {
			const previewUrl = URL.createObjectURL(value)
			setFormData({ ...formData, imagePreview: previewUrl })
			setEditableFields({ ...editableFields, images: true })
		} else {
			setFormData({ ...formData, [name]: value })
		}
	}

	// Clear form
	const handleCancel = () => {
		setShowAddProduct(false)
		setShowEditProduct(false)
		setShowViewProduct(false)
		setEditingProduct(null)
		setViewingProduct(null)
		setFormData({
			name: '',
			price: '',
			deliveryService: 'yes',
			stock: '',
			height: '',
			age: '',
			region: '',
			categoryId: '',
			imagePreview: null,
		})
		setEditableFields({
			name: false,
			price: false,
			deliveryService: false,
			stock: false,
			height: false,
			age: false,
			region: false,
			categoryId: false,
			images: false,
		})
	}

	// Form post
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const sallerId = localStorage.getItem('userId')
			if (!sallerId) throw new Error('Sotuvchi ID topilmadi')

			const requiredFields = [
				'name',
				'price',
				'stock',
				'height',
				'age',
				'region',
				'categoryId',
			]
			if (requiredFields.some(field => !formData[field]?.trim())) {
				throw new Error('Barcha maydonlarni toldiring')
			}

			if (!['yes', 'no'].includes(formData.deliveryService)) {
				throw new Error(
					'Yetkazib berish xizmati "Mavjud" yoki "Mavjud emas" bo‘lishi kerak'
				)
			}

			const data = new FormData()
			for (const key in formData) {
				if (key !== 'imagePreview' && formData[key])
					data.append(key, formData[key])
			}
			data.append('sallerId', sallerId)
			const fileInput = document.querySelector(
				'input[name="images"]'
			) as HTMLInputElement
			if (fileInput?.files?.[0]) data.append('images', fileInput.files[0])

			// FormData consolling
			const formDataObject: FormDataObject = {}
			data.forEach((value, key) => {
				formDataObject[key] = value
			})
			console.log("Yuborilgan ma'lumotlar:", formDataObject)

			await createProduct(data)
			toast.success('Mahsulot muvaffaqiyatli qo‘shildi', {
				icon: <CheckCircle className='w-5 h-5 text-forest' />,
			})

			handleCancel()
			setProducts(await getMyProducts())
		} catch (error: unknown) {
			toast.error(
				error instanceof Error ? error.message : 'Mahsulot qo‘shishda xatolik',
				{
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				}
			)
		}
	}

	return (
		<>
			<div className='flex justify-between items-center'>
				<h2 className='text-2xl font-bold text-forest'>Mahsulotlar</h2>
				<Button
					onClick={() => {
						setShowAddProduct(true)
						setShowEditProduct(false)
						setShowViewProduct(false)
						setEditingProduct(null)
						setViewingProduct(null)
						setFormData({
							name: '',
							price: '',
							deliveryService: 'yes',
							stock: '',
							height: '',
							age: '',
							region: '',
							categoryId: '',
							imagePreview: null,
						})
					}}
					className='bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest'
				>
					<Plus className='w-4 h-4 mr-2' />
					Yangi Mahsulot
				</Button>
			</div>

			{showAddProduct && (
				<Card className='shadow-nature'>
					<CardHeader>
						<CardTitle className='text-forest'>
							Yangi Mahsulot Qo‘shish
						</CardTitle>
						<CardDescription>
							Mahsulot ma'lumotlarini to'ldiring
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<form onSubmit={handleSubmit}>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='product-name'>Mahsulot nomi</Label>
									<Input
										id='product-name'
										name='name'
										value={formData.name}
										onChange={e => handleChange('name', e.target.value)}
										placeholder="Masalan: Olma daraxti ko'chati"
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='product-price'>Narxi (so'm)</Label>
									<Input
										id='product-price'
										name='price'
										type='number'
										value={formData.price}
										onChange={e => handleChange('price', e.target.value)}
										placeholder='0'
										required
									/>
								</div>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='product-deliveryService'>
										Yetkazib berish xizmati
									</Label>
									<select
										id='product-deliveryService'
										name='deliveryService'
										value={formData.deliveryService}
										onChange={e =>
											handleChange('deliveryService', e.target.value)
										}
										className='w-full p-2 border border-border rounded-md bg-background text-forest focus:outline-none focus:ring-2 focus:ring-forest/50'
										required
									>
										<option value='' disabled>
											Tanlang
										</option>
										<option value='yes'>Mavjud</option>
										<option value='no'>Mavjud emas</option>
									</select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='product-stock'>Miqdori</Label>
									<Input
										id='product-stock'
										name='stock'
										type='number'
										value={formData.stock}
										onChange={e => handleChange('stock', e.target.value)}
										placeholder='0'
										required
									/>
								</div>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='product-height'>Balandlik</Label>
									<Input
										id='product-height'
										name='height'
										type='number'
										value={formData.height}
										onChange={e => handleChange('height', e.target.value)}
										placeholder='0'
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='product-age'>Yosh</Label>
									<Input
										id='product-age'
										name='age'
										type='number'
										value={formData.age}
										onChange={e => handleChange('age', e.target.value)}
										placeholder='0'
										required
									/>
								</div>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='product-region'>Hududlar</Label>
									<select
										id='product-region'
										name='region'
										value={formData.region}
										onChange={e => handleChange('region', e.target.value)}
										className='w-full p-2 border border-border rounded-md bg-background text-forest focus:outline-none focus:ring-2 focus:ring-forest/50'
										required
									>
										<option value='' disabled>
											Viloyat tanlang
										</option>
										<option value='Andijon'>Andijon</option>
										<option value='Buxoro'>Buxoro</option>
										<option value='Farg‘ona'>Farg‘ona</option>
										<option value='Jizzax'>Jizzax</option>
										<option value='Xorazm'>Xorazm</option>
										<option value='Namangan'>Namangan</option>
										<option value='Navoiy'>Navoiy</option>
										<option value='Qashqadaryo'>Qashqadaryo</option>
										<option value='Qoraqalpog‘iston'>
											Qoraqalpog‘iston Respublikasi
										</option>
										<option value='Samarqand'>Samarqand</option>
										<option value='Sirdaryo'>Sirdaryo</option>
										<option value='Surxondaryo'>Surxondaryo</option>
										<option value='Toshkent'>Toshkent</option>
										<option value='Toshkent shahri'>Toshkent shahri</option>
									</select>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='product-categoryId'>Kategoriya</Label>
									<select
										id='product-categoryId'
										name='categoryId'
										value={formData.categoryId}
										onChange={e => handleChange('categoryId', e.target.value)}
										className='w-full p-2 border border-border rounded-md bg-background text-forest focus:outline-none focus:ring-2 focus:ring-forest/50'
										required
									>
										<option value='' disabled>
											Kategoriya tanlang
										</option>
										<option value='1'>Meva ko‘chat</option>
										<option value='2'>Manzarali daraxt ko'chat</option>
										<option value='3'>Ignabargli daraxt ko'chat</option>
									</select>
								</div>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='product-images'>Rasm yuklash</Label>
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
									<p className='text-muted-foreground'>
										{formData.imagePreview
											? 'Boshqa rasm yuklash uchun bosing'
											: 'Rasm yuklash uchun bosing yoki sudrab tashlang'}
									</p>
									<input
										type='file'
										id='product-images'
										name='images'
										onChange={e => handleChange('images', e.target.files?.[0])}
										accept='image/*'
										className='hidden'
									/>
									<label htmlFor='product-images'>
										<Button variant='outline' className='mt-2' asChild>
											<span>Fayl tanlash</span>
										</Button>
									</label>
								</div>
							</div>
							<div className='flex space-x-4'>
								<Button
									type='submit'
									className='bg-gradient-to-r from-forest to-moss hover:from-primary-hover hover:to-forest'
								>
									Sotuvga chiqarish
								</Button>
								<Button variant='outline' onClick={handleCancel}>
									Bekor qilish
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}
		</>
	)
}

export default CreateProduct
