import type { User, Group, Challenge, UserChallengeCompletion } from '../shared/schema.js'

export class MemStorage {
    private groups: Map<number, Group> = new Map()
    private users: Map<number, User> = new Map()
    private challenges: Map<number, Challenge> = new Map()
    private completions: Map<number, UserChallengeCompletion> = new Map()
    private currentGroupId = 1
    private currentUserId = 1
    private currentChallengeId = 1
    private currentCompletionId = 1

    // Groups
    async createGroup(name: string): Promise<Group> {
        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        const group: Group = {
            id: this.currentGroupId++,
            name,
            inviteCode
        }
        this.groups.set(group.id, group)
        return group
    }

    async getGroupByInviteCode(inviteCode: string): Promise<Group | undefined> {
        return Array.from(this.groups.values()).find(g => g.inviteCode === inviteCode)
    }

    async getGroupById(id: number): Promise<Group | undefined> {
        return this.groups.get(id)
    }

    // Users
    async createUser(username: string, groupId: number): Promise<User> {
        const user: User = {
            id: this.currentUserId++,
            username,
            groupId,
            points: 0
        }
        this.users.set(user.id, user)
        return user
    }

    async getUserById(id: number): Promise<User | undefined> {
        return this.users.get(id)
    }

    async getUserByUsernameAndGroup(username: string, groupId: number): Promise<User | undefined> {
        return Array.from(this.users.values()).find(u => u.username === username && u.groupId === groupId)
    }

    async updateUserPoints(userId: number, points: number): Promise<User> {
        const user = this.users.get(userId)!
        const updatedUser = { ...user, points }
        this.users.set(userId, updatedUser)
        return updatedUser
    }

    async getUsersByGroup(groupId: number): Promise<User[]> {
        return Array.from(this.users.values()).filter(u => u.groupId === groupId)
    }

    // Challenges
    async createChallenge(challenge: Omit<Challenge, 'id'>): Promise<Challenge> {
        const newChallenge: Challenge = {
            ...challenge,
            id: this.currentChallengeId++
        }
        this.challenges.set(newChallenge.id, newChallenge)
        return newChallenge
    }

    async getChallengesByGroup(groupId: number): Promise<Challenge[]> {
        return Array.from(this.challenges.values()).filter(c => c.groupId === groupId)
    }

    async deleteChallenge(id: number): Promise<boolean> {
        return this.challenges.delete(id)
    }

    async getChallengeById(id: number): Promise<Challenge | undefined> {
        return this.challenges.get(id)
    }

    // Completions
    async createCompletion(userId: number, challengeId: number): Promise<UserChallengeCompletion> {
        const completion: UserChallengeCompletion = {
            id: this.currentCompletionId++,
            userId,
            challengeId,
            completedAt: new Date()
        }
        this.completions.set(completion.id, completion)
        return completion
    }

    async getCompletionsByUser(userId: number): Promise<UserChallengeCompletion[]> {
        return Array.from(this.completions.values()).filter(c => c.userId === userId)
    }

    async getCompletionsByChallenge(challengeId: number): Promise<UserChallengeCompletion[]> {
        return Array.from(this.completions.values()).filter(c => c.challengeId === challengeId)
    }

    async isUserChallengeCompleted(userId: number, challengeId: number): Promise<boolean> {
        return Array.from(this.completions.values()).some(c => c.userId === userId && c.challengeId === challengeId)
    }
}

export const storage = new MemStorage()