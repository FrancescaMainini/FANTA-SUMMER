import { z } from 'zod'

export const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
    groupCode: z.string().min(1, 'Group code is required')
})

export const createGroupSchema = z.object({
    name: z.string().min(1, 'Group name is required')
})

export const createChallengeSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    points: z.number().min(1, 'Points must be at least 1'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    icon: z.string().min(1, 'Icon is required')
})

export interface User {
    id: number
    username: string
    groupId: number
    points: number
}

export interface Group {
    id: number
    name: string
    inviteCode: string
}

export interface Challenge {
    id: number
    title: string
    description: string
    points: number
    difficulty: string
    icon: string
    groupId: number
}

export interface UserChallengeCompletion {
    id: number
    userId: number
    challengeId: number
    completedAt: Date
}

export type LoginRequest = z.infer<typeof loginSchema>
export type CreateGroupRequest = z.infer<typeof createGroupSchema>
export type CreateChallengeRequest = z.infer<typeof createChallengeSchema>