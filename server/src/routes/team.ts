import {Router} from 'express'
import isAuthenticated from '../middleware/auth'
import { createTeam, getTeams } from '../controllers/team'
const router = Router()

router.use(isAuthenticated)
router.get('/teams', getTeams)
router.post('/teams', createTeam)

export default router