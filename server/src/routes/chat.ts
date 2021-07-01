import {Router} from 'express'
import { getChats } from '../controllers/chat'

const router = Router()

router.post('/chat', getChats)

export default router