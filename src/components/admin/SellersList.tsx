import { useEffect, useState } from 'react'
import { deleteSeller, getAllSellers } from '@/services/admin'
import { SellerT } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

export default function SellersList() {
	const [sellers, setSellers] = useState<SellerT[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

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

	const handleDelete = async (id: number) => {
		if (!confirm('Haqiqatan o`chirilsinmi?')) return
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

	return (
		<div className='min-h-screen bg-muted p-4 sm:p-6'>
			<div className='w-full mx-auto space-y-6'>
				<h1 className='text-2xl sm:text-3xl font-bold text-forest text-center'>
					Sotuvchilar ro`yxati
				</h1>
				{loading ? (
					<p className='text-center text-forest text-lg'>
						Ma`lumotlar yuklanmoqda...
					</p>
				) : error ? (
					<p className='text-center text-red-500 text-lg'>
						Sotuvchilar topilmadi
					</p>
				) : sellers.length === 0 ? (
					<p className='text-center text-forest text-lg'>
						Sotuvchilar mavjud emas
					</p>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{sellers.map((s, i) => (
							<div
								key={s.id}
								className='bg-white p-4 rounded-lg shadow-md border border-forest/20'
							>
								<div className='space-y-2'>
									<p className='text-forest font-medium'>#{i + 1}</p>
									<p>
										<span className='font-semibold text-forest'>Ism:</span>{' '}
										{s.fullName}
									</p>
									<p>
										<span className='font-semibold text-forest'>Email:</span>{' '}
										{s.email}
									</p>
									<p>
										<span className='font-semibold text-forest'>Telefon:</span>{' '}
										{s.phone}
									</p>
									<p>
										<span className='font-semibold text-forest'>
											Biznes nomi:
										</span>{' '}
										{s.businessName}
									</p>
									<p>
										<span className='font-semibold text-forest'>Manzil:</span>{' '}
										{s.address}
									</p>
									<p>
										<span className='font-semibold text-forest'>Tajriba:</span>{' '}
										{s.experience}
									</p>
									<Button
										onClick={() => handleDelete(s.id!)}
										className='w-full bg-red-500 hover:bg-red-600 text-white mt-2'
										size='sm'
									>
										<Trash2 className='w-4 h-4 mr-2' />
										O`chirish
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
