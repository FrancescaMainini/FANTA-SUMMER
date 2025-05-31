import { Router } from 'express'
import type { Express } from 'express'
import { storage } from './storage.js'
import { loginSchema, createGroupSchema, createChallengeSchema } from '../shared/schema.js'

declare module 'express-session' {
    interface SessionData {
        userId?: number
        groupId?: number
    }
}

export async function registerRoutes(app: Express) {
    const router = Router()

    // Auth routes
    router.post('/auth/login', async (req, res) => {
        try {
            const { username, password, groupCode } = loginSchema.parse(req.body)

            const group = await storage.getGroupByInviteCode(groupCode)
            if (!group) {
                return res.status(400).json({ message: 'Invalid group code' })
            }

            let user = await storage.getUserByUsernameAndGroup(username, group.id)
            if (!user) {
                user = await storage.createUser(username, group.id)
            }

            req.session.userId = user.id
            req.session.groupId = group.id

            res.json({ user, group })
        } catch (error) {
            res.status(400).json({ message: 'Invalid request data' })
        }
    })

    router.post('/auth/logout', (req, res) => {
        req.session.destroy(() => {
            res.json({ message: 'Logged out successfully' })
        })
    })

    router.get('/auth/me', async (req, res) => {
        if (!req.session.userId || !req.session.groupId) {
            return res.status(401).json({ message: 'Authentication required' })
        }

        const user = await storage.getUserById(req.session.userId)
        const group = await storage.getGroupById(req.session.groupId)

        if (!user || !group) {
            return res.status(401).json({ message: 'Invalid session' })
        }

        res.json({ user, group })
    })

    router.post('/groups', async (req, res) => {
        try {
            const { name } = createGroupSchema.parse(req.body)
            const group = await storage.createGroup(name)
            res.json(group)
        } catch (error) {
            res.status(400).json({ message: 'Invalid request data' })
        }
    })

    // Challenge routes
    router.get('/challenges', async (req, res) => {
        if (!req.session.groupId) {
            return res.status(401).json({ message: 'Authentication required' })
        }

        const challenges = await storage.getChallengesByGroup(req.session.groupId)
        const completions = await storage.getCompletionsByUser(req.session.userId!)

        const challengesWithCompletion = challenges.map(challenge => ({
            ...challenge,
            isCompleted: completions.some(c => c.challengeId === challenge.id),
            completedCount: 0 // We'll calculate this
        }))

        // Calculate completion counts
        for (const challenge of challengesWithCompletion) {
            const challengeCompletions = await storage.getCompletionsByChallenge(challenge.id)
            challenge.completedCount = challengeCompletions.length
        }

        res.json(challengesWithCompletion)
    })

    router.post('/challenges', async (req, res) => {
        if (!req.session.groupId) {
            return res.status(401).json({ message: 'Authentication required' })
        }

        try {
            const challengeData = createChallengeSchema.parse(req.body)
            const challenge = await storage.createChallenge({
                ...challengeData,
                groupId: req.session.groupId
            })
            res.json(challenge)
        } catch (error) {
            res.status(400).json({ message: 'Invalid request data' })
        }
    })

    router.delete('/challenges/:id', async (req, res) => {
        if (!req.session.groupId) {
            return res.status(401).json({ message: 'Authentication required' })
        }

        const challengeId = parseInt(req.params.id)
        const success = await storage.deleteChallenge(challengeId)

        if (success) {
            res.json({ message: 'Challenge deleted successfully' })
        } else {
            res.status(404).json({ message: 'Challenge not found' })
        }
    })

    router.post('/challenges/:id/complete', async (req, res) => {
        if (!req.session.userId || !req.session.groupId) {
            return res.status(401).json({ message: 'Authentication required' })
        }

        const challengeId = parseInt(req.params.id)
        const userId = req.session.userId

        const isCompleted = await storage.isUserChallengeCompleted(userId, challengeId)
        if (isCompleted) {
            return res.status(400).json({ message: 'Challenge already completed' })
        }

        const challenge = await storage.getChallengeById(challengeId)
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' })
        }

        await storage.createCompletion(userId, challengeId)

        const user = await storage.getUserById(userId)
        await storage.updateUserPoints(userId, user!.points + challenge.points)

        res.json({ message: 'Challenge completed successfully' })
    })

    // Users/Leaderboard routes
    router.get('/users', async (req, res) => {
        if (!req.session.groupId) {
            return res.status(401).json({ message: 'Authentication required' })
        }

        const users = await storage.getUsersByGroup(req.session.groupId)
        users.sort((a, b) => b.points - a.points)
        res.json(users)
    })

    router.get('/stats', async (req, res) => {
        if (!req.session.groupId) {
            return res.status(401).json({ message: 'Authentication required' })
        }

        const challenges = await storage.getChallengesByGroup(req.session.groupId)
        const users = await storage.getUsersByGroup(req.session.groupId)

        const totalPoints = users.reduce((sum, user) => sum + user.points, 0)
        const averageScore = users.length > 0 ? Math.round(totalPoints / users.length) : 0

        const stats = {
            totalChallenges: challenges.length,
            activeMembers: users.length,
            completedToday: 0, // Simplified for this example
            averageScore,
            groupScore: totalPoints
        }

        res.json(stats)
    })

    app.use('/api', router)
}