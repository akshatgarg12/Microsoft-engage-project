import { Router } from 'express'
import isAuthenticated from '../middleware/auth'
import { createTeam, getTeam, getTeams, addMember } from '../controllers/team'
const router = Router()

router.use(isAuthenticated)
router.get('/team/:id', getTeam)
router.post('/team/addMember', addMember)
router.get('/teams', getTeams)
router.post('/teams', createTeam)

export default router
