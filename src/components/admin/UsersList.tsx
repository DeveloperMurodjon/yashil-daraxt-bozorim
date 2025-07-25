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
			<div className='w-full mx-auto space-y-6 max-w-7xl'>
				<h1 className='text-lg sm:text-2xl md:text-3xl font-bold text-forest text-center'>
					Xaridorlar ro`yxati
				</h1>
				{loading ? (
					<p className='text-center text-forest text-sm sm:text-lg'>
						Ma`lumotlar yuklanmoqda...
					</p>
				) : error ? (
					<p className='text-center text-red-500 text-sm sm:text-lg'>
						Xaridorlar topilmadi
					</p>
				) : users.length === 0 ? (
					<p className='text-center text-forest text-sm sm:text-lg'>
						Xaridorlar mavjud emas
					</p>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full bg-white rounded-lg shadow-md border border-forest/20'>
							<thead>
								<tr className='bg-sage/20 text-forest text-left text-xs sm:text-sm'>
									<th className='p-2 sm:p-3'>#</th>
									<th className='p-2 sm:p-3'>Ism</th>
									<th className='p-2 sm:p-3'>Email</th>
									<th className='p-2 sm:p-3'>Telefon</th>
									<th className='p-2 sm:p-3'>Amallar</th>
								</tr>
							</thead>
							<tbody>
								{users.map((u, i) => (
									<tr
										key={u.id}
										className='border-t border-forest/20 text-xs sm:text-sm'
									>
										<td className='p-2 sm:p-3'>{i + 1}</td>
										<td className='p-2 sm:p-3'>{u.fullName}</td>
										<td className='p-2 sm:p-3'>{u.email}</td>
										<td className='p-2 sm:p-3'>{u.phone}</td>
										<td className='p-2 sm:p-3'>
											<Button
												onClick={() => handleDelete(u.id)}
												className='bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm'
												size='sm'
											>
												<Trash2 className='w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2' />
												O`chirish
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}
