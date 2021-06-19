import {Router} from 'express'
import isAuthenticated from '../middleware/auth'
import {currentUser, login, logout, register} from '../controllers/auth'
const router = Router()

router.post('/login', login)
router.post('/register', register)
router.get('/user', isAuthenticated, currentUser)
router.post('/logout', logout)
export default router