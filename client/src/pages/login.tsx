import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../hooks/use-auth'
import { loginSchema, createGroupSchema } from '../../../shared/schema'
import type { LoginRequest, CreateGroupRequest } from '../../../shared/schema'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { useToast } from '../hooks/use-toast'

export default function Login() {
    const { login, createGroup } = useAuth()
    const { toast } = useToast()
    const [isCreatingGroup, setIsCreatingGroup] = useState(false)

    const loginForm = useForm<LoginRequest>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
            groupCode: ''
        }
    })

    const createGroupForm = useForm<CreateGroupRequest>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: {
            name: ''
        }
    })

    const onLogin = async (data: LoginRequest) => {
        try {
            await login(data)
        } catch (error) {
            toast({
                title: 'Login Failed',
                description: error instanceof Error ? error.message : 'Please check your credentials',
                variant: 'destructive'
            })
        }
    }

    const onCreateGroup = async (data: CreateGroupRequest) => {
        try {
            setIsCreatingGroup(true)
            const group = await createGroup(data)
            toast({
                title: 'Group Created!',
                description: `Your group "${group.name}" has been created. Invite code: ${group.inviteCode}`
            })
            createGroupForm.reset()
        } catch (error) {
            toast({
                title: 'Creation Failed',
                description: error instanceof Error ? error.message : 'Failed to create group',
                variant: 'destructive'
            })
        } finally {
            setIsCreatingGroup(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                        Fanta Summer
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Join the ultimate summer challenge platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Join Group</TabsTrigger>
                            <TabsTrigger value="create">Create Group</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        {...loginForm.register('username')}
                                        placeholder="Enter your username"
                                    />
                                    {loginForm.formState.errors.username && (
                                        <p className="text-sm text-red-500">{loginForm.formState.errors.username.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...loginForm.register('password')}
                                        placeholder="Enter your password"
                                    />
                                    {loginForm.formState.errors.password && (
                                        <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="groupCode">Group Code</Label>
                                    <Input
                                        id="groupCode"
                                        {...loginForm.register('groupCode')}
                                        placeholder="Enter group invite code"
                                    />
                                    {loginForm.formState.errors.groupCode && (
                                        <p className="text-sm text-red-500">{loginForm.formState.errors.groupCode.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700"
                                    disabled={loginForm.formState.isSubmitting}
                                >
                                    {loginForm.formState.isSubmitting ? 'Joining...' : 'Join Group'}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="create">
                            <form onSubmit={createGroupForm.handleSubmit(onCreateGroup)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="groupName">Group Name</Label>
                                    <Input
                                        id="groupName"
                                        {...createGroupForm.register('name')}
                                        placeholder="Enter group name"
                                    />
                                    {createGroupForm.formState.errors.name && (
                                        <p className="text-sm text-red-500">{createGroupForm.formState.errors.name.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700"
                                    disabled={isCreatingGroup}
                                >
                                    {isCreatingGroup ? 'Creating...' : 'Create Group'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}