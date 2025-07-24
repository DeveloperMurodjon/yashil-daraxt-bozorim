import { useEffect, useState } from 'react'
import { getAllUsers, deleteUser } from '@/services/admin'
import { UserT } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

export default function UsersList() {
	const [users, setUsers] = useState<UserT[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	useEffect(() => {
		setLoading(true)
		getAllUsers()
			.then(data => {
				setUsers(data)
				setLoading(false)
			})
			.catch(err => {
				setError(true)
				toast.error(
					err.response?.data?.error?.message ||
						'Foydalanuvchilarni olishda xatolik',
					{
						icon: <AlertCircle className='w-5 h-5 text-red-500' />,
					}
				)
				setLoading(false)
			})
	}, [])

	const handleDelete = async (id: number) => {
		if (!confirm('Haqiqatan foydalanuvchini ochirmoqchimisiz?')) return
		try {
			await deleteUser(id)
			setUsers(prev => prev.filter(u => u.id !== id))
			toast.success('Foydalanuvchi muvaffaqiyatli o`chirildi', {
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
					Xaridorlar ro`yxati
				</h1>
				{loading ? (
					<p className='text-center text-forest text-lg'>
						Ma`lumotlar yuklanmoqda...
					</p>
				) : error ? (
					<p className='text-center text-red-500 text-lg'>
						Xaridorlar topilmadi
					</p>
				) : users.length === 0 ? (
					<p className='text-center text-forest text-lg'>
						Xaridorlar mavjud emas
					</p>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{users.map((u, i) => (
							<div
								key={u.id}
								className='bg-white p-4 rounded-lg shadow-md border border-forest/20'
							>
								<div className='space-y-2'>
									<p className='text-forest font-medium'>#{i + 1}</p>
									<p>
										<span className='font-semibold text-forest'>Ism:</span>{' '}
										{u.fullName}
									</p>
									<p>
										<span className='font-semibold text-forest'>Email:</span>{' '}
										{u.email}
									</p>
									<p>
										<span className='font-semibold text-forest'>Telefon:</span>{' '}
										{u.phone}
									</p>
									<Button
										onClick={() => handleDelete(u.id)}
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
