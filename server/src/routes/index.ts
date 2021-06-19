import {Router} from 'express'
import AuthRoute from './auth'
import TeamRoute from './team'
const router = Router()

router.use('/', [AuthRoute, TeamRoute])

export default router