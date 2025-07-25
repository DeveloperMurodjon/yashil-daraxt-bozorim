import { AdminTabT } from '@/types/types'
import { Users, UserPlus, Store, PlusCircle, LogOut } from 'lucide-react'

type Props = {
	active: AdminTabT
	onNavigate: (page: AdminTabT) => void
	onLogout: () => void
}

function Sidebar({ active, onNavigate, onLogout }: Props) {
	return (
		<div className='w-full md:w-64 flex-shrink-0 bg-muted p-4 sm:p-6 flex flex-col gap-6 font-sans shadow-lg'>
			<h2 className='text-lg sm:text-xl md:text-2xl font-bold text-forest'>
				Boshqaruv Paneli
			</h2>
			<div className='space-y-3 flex-grow'>
				<button
					onClick={() => onNavigate('users')}
					className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
						active === 'users'
							? 'bg-sage/50 border-2 border-forest text-forest font-semibold'
							: 'bg-white hover:bg-sage/30 text-gray-700 hover:text-forest'
					}`}
				>
					<Users className='w-4 sm:w-5 h-4 sm:h-5 mr-3' />
					Xaridorlar
				</button>
				<button
					onClick={() => onNavigate('createUser')}
					className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
						active === 'createUser'
							? 'bg-sage/50 border-2 border-forest text-forest font-semibold'
							: 'bg-white hover:bg-sage/30 text-gray-700 hover:text-forest'
					}`}
				>
					<UserPlus className='w-4 sm:w-5 h-4 sm:h-5 mr-3' />
					Xaridor yaratish
				</button>
				<button
					onClick={() => onNavigate('sellers')}
					className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
						active === 'sellers'
							? 'bg-sage/50 border-2 border-forest text-forest font-semibold'
							: 'bg-white hover:bg-sage/30 text-gray-700 hover:text-forest'
					}`}
				>
					<Store className='w-4 sm:w-5 h-4 sm:h-5 mr-3' />
					Sotuvchilar
				</button>
				<button
					onClick={() => onNavigate('createSeller')}
					className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
						active === 'createSeller'
							? 'bg-sage/50 border-2 border-forest text-forest font-semibold'
							: 'bg-white hover:bg-sage/30 text-gray-700 hover:text-forest'
					}`}
				>
					<PlusCircle className='w-4 sm:w-5 h-4 sm:h-5 mr-3' />
					Sotuvchi yaratish
				</button>
				<button
					onClick={onLogout}
					className='w-full flex items-center p-3 rounded-lg transition-all duration-300 bg-white hover:bg-red-100 text-gray-700 hover:text-red-500 text-sm sm:text-base mt-auto'
				>
					<LogOut className='w-4 sm:w-5 h-4 sm:h-5 mr-3' />
					Chiqish
				</button>
			</div>
		</div>
	)
}

export default Sidebar
