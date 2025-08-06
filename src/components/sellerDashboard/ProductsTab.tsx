import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { getMyProducts, deleteProduct } from '@/services/productService'
import { Product } from '@/types/types'
import CreateProduct from './productsTab/CreateProduct'
import MyProducts from './productsTab/MyProducts'
import UpdateProduct from './productsTab/UpdateProduct'

const ProductsTab: React.FC = () => {
	const [showAddProduct, setShowAddProduct] = useState(false)
	const [showEditProduct, setShowEditProduct] = useState(false)
	const [showViewProduct, setShowViewProduct] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
	const [formData, setFormData] = useState({
		name: '',
		price: '',
		deliveryService: 'yes',
		stock: '',
		height: '',
		age: '',
		region: '',
		categoryId: '',
		imagePreview: null as string | null,
	})
	const [editableFields, setEditableFields] = useState({
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
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const data = await getMyProducts()
				console.log('Products:', data)
				setProducts(data)
			} catch (error) {
				toast.error('Mahsulotlarni yuklashda xatolik yuz berdi', {
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				})
			} finally {
				setLoading(false)
			}
		}
		fetchProducts()
	}, [])

	const handleEdit = (product: Product) => {
		setEditingProduct(product)
		setFormData({
			name: product.name || '',
			price: product.price.toString() || '',
			deliveryService: product.deliveryService || 'yes',
			stock: product.stock.toString() || '',
			height: product.height.toString() || '',
			age: product.age.toString() || '',
			region: product.region || '',
			categoryId: product.category.id.toString() || '',
			imagePreview: product.images?.[0]?.ImageUrl || null,
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
		setShowEditProduct(true)
		setShowAddProduct(false)
	}

	const handleView = (product: Product) => {
		setViewingProduct(product)
		setShowViewProduct(true)
	}

	const handleDelete = async (productId: number) => {
		if (window.confirm('Mahsulotni o`chirishni xohlaysizmi?')) {
			try {
				await deleteProduct(productId)
				toast.success('Mahsulot muvaffaqiyatli o`chirildi', {
					icon: <CheckCircle className='w-5 h-5 text-forest' />,
				})
				const updatedProducts = await getMyProducts()
				setProducts(updatedProducts)
			} catch (error) {
				toast.error(error.message || 'Mahsulotni o`chirishda xatolik', {
					icon: <AlertCircle className='w-5 h-5 text-red-500' />,
				})
			}
		}
	}

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

	if (loading) {
		return <div className='text-center p-4'>Yuklanmoqda...</div>
	}

	return (
		<div className='space-y-6'>
			<CreateProduct
				showAddProduct={showAddProduct}
				setShowAddProduct={setShowAddProduct}
				setShowEditProduct={setShowEditProduct}
				setShowViewProduct={setShowViewProduct}
				setEditingProduct={setEditingProduct}
				setViewingProduct={setViewingProduct}
				formData={formData}
				setFormData={setFormData}
				editableFields={editableFields}
				setEditableFields={setEditableFields}
				setProducts={setProducts}
			/>
			<UpdateProduct
				showEditProduct={showEditProduct}
				setShowEditProduct={setShowEditProduct}
				editingProduct={editingProduct}
				formData={formData}
				setFormData={setFormData}
				editableFields={editableFields}
				setEditableFields={setEditableFields}
				setProducts={setProducts}
				handleCancel={handleCancel}
			/>
			<MyProducts
				products={products}
				showViewProduct={showViewProduct}
				setShowViewProduct={setShowViewProduct}
				viewingProduct={viewingProduct}
				handleEdit={handleEdit}
				handleView={handleView}
				handleDelete={handleDelete}
			/>
		</div>
	)
}

export default ProductsTab
