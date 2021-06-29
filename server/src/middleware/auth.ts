import type { RequestHandler, Request, Response, NextFunction } from 'express'
import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
import User from '../models/user'
config()
const secret: string = process.env.JWT_SECRET || 'secret'

export const getUserFromCookie = async (user: string) => {
  try {
    const data = jwt.verify(user, secret)
    const { _id }: any = data
    if (!data) return null
    const userData = await User.findOne({ _id })
    if (userData) {
      userData.password = undefined
      return userData
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}
const isAuthenticated: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req.cookies
    if (!user) {
      return res.status(403).json({ status: '403', log: 'Please login!' })
    }
    const userData = await getUserFromCookie(user)
    if (userData) {
      userData.password = undefined
      // @ts-expect-error
      req.user = userData
      return next()
    } else {
      return res.status(403).json({ status: '403', log: 'Please login!' })
    }
  } catch (e) {
    console.error(e)
    return res.status(500).json({ status: '500', log: 'Server error, try again later!' })
  }
}

export default isAuthenticated
