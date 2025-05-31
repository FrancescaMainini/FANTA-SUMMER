import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/use-auth'
import { Toaster } from './components/ui/toaster'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import NotFound from './pages/not-found'

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-blue-600">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App