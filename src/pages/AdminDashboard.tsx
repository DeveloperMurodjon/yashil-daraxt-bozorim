import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import { AdminTabT } from '@/types/types'
import {
	UsersList,
	CreateUser,
	SellersList,
	CreateSeller,
} from '@/components/admin/index'
import { CheckCircle } from 'lucide-react'
import { toast } from 'react-toastify'

function AdminDashboard() {
	const [activePage, setActivePage] = useState<AdminTabT>('users')
	const navigate = useNavigate()

	const handleLogout = () => {
		localStorage.clear()
		toast.success('Tizimdan chiqdingiz', {
			icon: <CheckCircle className='w-5 h-5 text-forest' />,
		})
		navigate('/admin')
	}

	return (
		<div className='flex min-h-screen bg-muted flex-col md:flex-row'>
			<Sidebar
				active={activePage}
				onNavigate={setActivePage}
				onLogout={handleLogout}
			/>
			<div className='flex-1 p-4 sm:p-6 overflow-y-auto w-full'>
				<div className='w-full h-full max-w-7xl mx-auto'>
					{activePage === 'users' && <UsersList />}
					{activePage === 'createUser' && <CreateUser />}
					{activePage === 'sellers' && <SellersList />}
					{activePage === 'createSeller' && <CreateSeller />}
				</div>
			</div>
		</div>
	)
}

export default AdminDashboard
