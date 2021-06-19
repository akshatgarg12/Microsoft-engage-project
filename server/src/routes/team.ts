import {Router} from 'express'
import isAuthenticated from '../middleware/auth'
import { getTeams } from '../controllers/team'
const router = Router()

router.use(isAuthenticated)
router.get('/teams', getTeams)

export default router