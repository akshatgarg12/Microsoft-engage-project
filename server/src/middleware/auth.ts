import type { RequestHandler, Request, Response, NextFunction } from "express";
import {config} from 'dotenv'
import jwt from 'jsonwebtoken'
import User from '../models/user'
config()
const secret :string = process.env.JWT_SECRET || 'secret'
const isAuthenticated : RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const {user} = req.cookies
        if(!user){
            return res.status(403).json({status:'403', log:'Please login!'})
        }
        const data = jwt.verify(user,secret)
        const {_id}:any = data;
        const userData = await User.findOne({_id})
        if(userData){
            userData.password = undefined
            // @ts-ignore
            req.user = userData
            return next()
        }else{
            return res.status(403).json({status:'403', log:'Please login!'})
        }
    }catch(e){
        console.error(e)
        return res.status(500).json({status:'500', log:'Server error, try again later!'})
    }
   
}

export default isAuthenticated