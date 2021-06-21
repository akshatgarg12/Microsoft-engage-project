import {Router} from 'express'
import AuthRoute from './auth'
import TeamRoute from './team'
import MeetingRoute from './meeting'
const router = Router()

router.use('/', [AuthRoute, TeamRoute, MeetingRoute])

export default router