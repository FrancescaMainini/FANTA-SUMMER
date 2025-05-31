import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User, Group, LoginRequest, CreateGroupRequest } from '../../../shared/schema'

interface AuthContextType {
    user: User | null
    group: Group | null
    login: (data: LoginRequest) => Promise<void>
    logout: () => Promise<void>
    createGroup: (data: CreateGroupRequest) => Promise<Group>
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [group, setGroup] = useState<Group | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/me')
            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
                setGroup(data.group)
                navigate('/dashboard')
            }
        } catch (error) {
            console.error('Auth check failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (data: LoginRequest) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message)
        }

        const result = await response.json()
        setUser(result.user)
        setGroup(result.group)
        navigate('/dashboard')
    }

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        setUser(null)
        setGroup(null)
        navigate('/')
    }

    const createGroup = async (data: CreateGroupRequest) => {
        const response = await fetch('/api/groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message)
        }

        return response.json()
    }

    return (
        <AuthContext.Provider value={{ user, group, login, logout, createGroup, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}