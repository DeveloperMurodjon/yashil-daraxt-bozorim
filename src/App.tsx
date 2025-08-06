import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Index from './pages/Index'
import Auth from './pages/Auth'
import SellerDashboard from './pages/SellerDashboard'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'

const queryClient = new QueryClient()

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	const token = localStorage.getItem('access_token')
	const role = localStorage.getItem('role')
	if (!token || role !== 'admin') {
		return <Navigate to='/admin' replace />
	}
	return children
}

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<ToastContainer
				position='top-right'
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='light'
			/>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Index />} />
					<Route path='/auth' element={<Auth />} />
					<Route path='/seller-dashboard' element={<SellerDashboard />} />
					<Route path='/user-dashboard' element={<UserDashboard />} />
					<Route path='/profile' element={<Profile />} />
					<Route path='/admin' element={<AdminLogin />} />
					<Route
						path='/admin/dashboard'
						element={
							<ProtectedRoute>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>
					<Route path='*' element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
)

export default App
