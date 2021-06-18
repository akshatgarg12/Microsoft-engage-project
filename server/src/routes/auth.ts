import {Router} from 'express'
import isAuthenticated from '../middleware/auth'
import {currentUser, login, register} from '../controllers/auth'
const router = Router()

router.post('/login', login)
router.post('/register', register)
router.get('/user', isAuthenticated, currentUser)
export default router