import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ArrowLeft, User, Store } from 'lucide-react'
import Register from '@/components/Register'
import Login from '@/components/Login'
import { RoleType } from '@/services/auth'

type TabType = 'register' | 'login'

export default function Auth() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [tab, setTab] = useState<TabType>(
		searchParams.get('tab') === 'register' ? 'register' : 'login'
	)
	const [role, setRole] = useState<RoleType>(
		(searchParams.get('role') === 'seller' ? 'seller' : 'user') as RoleType
	)

	useEffect(() => {
		const newTab = searchParams.get('tab') === 'register' ? 'register' : 'login'
		const newRole = searchParams.get('role') === 'seller' ? 'seller' : 'user'
		setTab(newTab)
		setRole(newRole)
	}, [searchParams])

	const RoleSelector = () => (
		<div className='flex gap-2'>
			{(['user', 'seller'] as RoleType[]).map(r => (
				<div
					key={r}
					onClick={() => setRole(r)}
					className={`flex-1 border p-2 rounded cursor-pointer flex items-center gap-2 ${
						role === r
							? 'bg-sage/50 border-forest border-2'
							: 'border-forest/20'
					}`}
				>
					{r === 'user' ? (
						<User className='w-5 h-5 text-forest' />
					) : (
						<Store className='w-5 h-5 text-forest' />
					)}
					<p className='text-sm font-medium text-forest'>
						{r === 'user' ? 'Foydalanuvchi' : 'Sotuvchi'}
					</p>
				</div>
			))}
		</div>
	)

	return (
		<div className='min-h-screen flex items-center justify-center bg-muted p-4'>
			<div className='w-full max-w-md space-y-4'>
				<Link to='/' className='inline-flex items-center text-forest mb-4'>
					<ArrowLeft className='mr-2 w-4 h-4' />
					Bosh sahifaga qaytish
				</Link>
				<Tabs value={tab} onValueChange={v => setTab(v as TabType)}>
					<TabsList className='grid grid-cols-2 bg-sage/20'>
						<TabsTrigger value='register' className='text-forest'>
							Ro`yxatdan o`tish
						</TabsTrigger>
						<TabsTrigger value='login' className='text-forest'>
							Kirish
						</TabsTrigger>
					</TabsList>
					<TabsContent value='register'>
						<Register role={role} setTab={setTab} RoleSelector={RoleSelector} />
					</TabsContent>
					<TabsContent value='login'>
						<Login role={role} RoleSelector={RoleSelector} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
