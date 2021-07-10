import {Router} from 'express'
import { getChats, getMeetingChats } from '../controllers/chat'

const router = Router()

router.post('/chat', getChats)
router.post('/meeting/chat', getMeetingChats)
export default router