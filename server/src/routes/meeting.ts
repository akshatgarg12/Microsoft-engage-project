import { Router } from 'express'
import isAuthenticated from '../middleware/auth'
import { createMeeting, getMeetings } from '../controllers/meeting'
const router = Router()

router.use(isAuthenticated)
router.post('/meetings', getMeetings)
router.post('/meeting/create', createMeeting)

export default router
