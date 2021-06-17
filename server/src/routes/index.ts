import {Router} from 'express'
import AuthRoute from './auth'
const router = Router()

router.use('/', [AuthRoute])

export default router