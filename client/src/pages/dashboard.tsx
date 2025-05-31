import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../hooks/use-auth'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Plus, Trophy, Users, Target, TrendingUp, Share2, LogOut } from 'lucide-react'
import AddChallengeModal from '../components/add-challenge-modal'
import InviteModal from '../components/invite-modal'
import { useToast } from '../hooks/use-toast'

interface Challenge {
    id: number
    title: string
    description: string
    points: number
    difficulty: string
    icon: string
    isCompleted: boolean
    completedCount: number
}

interface Stats {
    totalChallenges: number
    activeMembers: number
    completedToday: number
    averageScore: number
    groupScore: number
}

export default function Dashboard() {
    const { user, group, logout } = useAuth()
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

    const { data: challenges = [], isLoading: challengesLoading } = useQuery({
        queryKey: ['/api/challenges'],
        queryFn: async () => {
            const response = await fetch('/api/challenges')
            if (!response.ok) throw new Error('Failed to fetch challenges')
            return response.json()
        }
    })

    const { data: users = [] } = useQuery({
        queryKey: ['/api/users'],
        queryFn: async () => {
            const response = await fetch('/api/users')
            if (!response.ok) throw new Error('Failed to fetch users')
            return response.json()
        }
    })

    const { data: stats } = useQuery({
        queryKey: ['/api/stats'],
        queryFn: async () => {
            const response = await fetch('/api/stats')
            if (!response.ok) throw new Error('Failed to fetch stats')
            return response.json()
        }
    })

    const completeChallengeMutation = useMutation({
        mutationFn: async (challengeId: number) => {
            const response = await fetch(`/api/challenges/${challengeId}/complete`, {
                method: 'POST'
            })
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message)
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/challenges'] })
            queryClient.invalidateQueries({ queryKey: ['/api/users'] })
            queryClient.invalidateQueries({ queryKey: ['/api/stats'] })
            toast({
                title: 'Challenge Completed!',
                description: 'Great job! Your points have been updated.'
            })
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
            })
        }
    })

    const deleteChallengeMutation = useMutation({
        mutationFn: async (challengeId: number) => {
            const response = await fetch(`/api/challenges/${challengeId}`, {
                method: 'DELETE'
            })
            if (!response.ok) throw new Error('Failed to delete challenge')
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/challenges'] })
            queryClient.invalidateQueries({ queryKey: ['/api/stats'] })
            toast({
                title: 'Challenge Deleted',
                description: 'The challenge has been removed.'
            })
        }
    })

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-800'
            case 'Medium': return 'bg-yellow-100 text-yellow-800'
            case 'Hard': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    if (!user || !group) return null

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                            {group.name}
                        </h1>
                        <p className="text-gray-600 mt-1">Welcome back, {user.username}!</p>
                        <p className="text-sm text-gray-500">Your Points: {user.points}</p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <Button
                            onClick={() => setIsInviteModalOpen(true)}
                            variant="outline"
                            className="border-orange-300 text-orange-600 hover:bg-orange-50"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Invite
                        </Button>
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Challenge
                        </Button>
                        <Button onClick={logout} variant="outline" size="sm">
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-white/90 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Target className="h-8 w-8 text-orange-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Challenges</p>
                                        <p className="text-2xl font-bold">{stats.totalChallenges}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/90 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Users className="h-8 w-8 text-blue-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Active Members</p>
                                        <p className="text-2xl font-bold">{stats.activeMembers}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/90 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <TrendingUp className="h-8 w-8 text-green-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Average Score</p>
                                        <p className="text-2xl font-bold">{stats.averageScore}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/90 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Trophy className="h-8 w-8 text-yellow-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Group Score</p>
                                        <p className="text-2xl font-bold">{stats.groupScore}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Challenges */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white/90 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Challenges</CardTitle>
                                <CardDescription>Complete challenges to earn points</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {challengesLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
                                        ))}
                                    </div>
                                ) : challenges.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">
                                        No challenges yet. Add one to get started!
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {challenges.map((challenge: Challenge) => (
                                            <div
                                                key={challenge.id}
                                                className={`p-4 rounded-lg border-2 transition-all ${challenge.isCompleted
                                                        ? 'bg-green-50 border-green-200'
                                                        : 'bg-white border-gray-200 hover:border-orange-300'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-2xl">{challenge.icon}</span>
                                                            <h3 className="font-semibold">{challenge.title}</h3>
                                                            <Badge className={getDifficultyColor(challenge.difficulty)}>
                                                                {challenge.difficulty}
                                                            </Badge>
                                                            <Badge variant="outline">
                                                                {challenge.points} pts
                                                            </Badge>
                                                        </div>
                                                        <p className="text-gray-600 mb-2">{challenge.description}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Completed by {challenge.completedCount} member(s)
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2 ml-4">
                                                        {!challenge.isCompleted && (
                                                            <Button
                                                                onClick={() => completeChallengeMutation.mutate(challenge.id)}
                                                                disabled={completeChallengeMutation.isPending}
                                                                size="sm"
                                                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                                            >
                                                                Complete
                                                            </Button>
                                                        )}
                                                        <Button
                                                            onClick={() => deleteChallengeMutation.mutate(challenge.id)}
                                                            disabled={deleteChallengeMutation.isPending}
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 border-red-300 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Leaderboard */}
                    <div>
                        <Card className="bg-white/90 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Leaderboard</CardTitle>
                                <CardDescription>Top performers in your group</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {users.map((member: any, index: number) => (
                                        <div
                                            key={member.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg ${member.id === user.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                                                    index === 1 ? 'bg-gray-400 text-gray-900' :
                                                        index === 2 ? 'bg-orange-400 text-orange-900' :
                                                            'bg-gray-200 text-gray-700'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{member.username}</p>
                                                <p className="text-sm text-gray-500">{member.points} points</p>
                                            </div>
                                            {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Modals */}
                <AddChallengeModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={() => {
                        setIsAddModalOpen(false)
                        queryClient.invalidateQueries({ queryKey: ['/api/challenges'] })
                        queryClient.invalidateQueries({ queryKey: ['/api/stats'] })
                    }}
                />

                <InviteModal
                    isOpen={isInviteModalOpen}
                    onClose={() => setIsInviteModalOpen(false)}
                    inviteCode={group.inviteCode}
                />
            </div>
        </div>
    )
}