import { Router } from 'express'
import isAuthenticated from '../middleware/auth'
import { currentUser, login, logout, register, getUser } from '../controllers/auth'
const router = Router()

router.post('/login', login)
router.post('/register', register)
router.get('/user', isAuthenticated, currentUser)
router.get('/user/:_id', isAuthenticated, getUser)
router.post('/logout', logout)
export default router
