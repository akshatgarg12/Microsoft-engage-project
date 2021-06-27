import {Router, Request, Response} from 'express'
import AuthRoute from './auth'
import TeamRoute from './team'
import MeetingRoute from './meeting'
const router = Router()

router.get('/' , (req:Request, res:Response) => {
    res.send("Hello, this is microsoft-teams-clone API")
})

router.use('/', [AuthRoute, TeamRoute, MeetingRoute])

export default router