import User from '../models/user'
import {Request, Response} from 'express'
import {config} from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
config()
const OneDayInSec = 1 * 24 * 60 * 60;

const secret :string = process.env.JWT_SECRET || 'secret'
const getToken = (_id:string) => {
  const token = jwt.sign({ _id }, secret, {
    expiresIn: OneDayInSec,
  });
  return token;
};
const __prod__ = process.env.NODE_ENV === "production";
const devCookieConfig = {
   httpOnly: true,
}
const prodCookieConfig = {
  httpOnly: true,
  sameSite: "None",
  secure: __prod__,
};
const cookieConfig = __prod__ ? prodCookieConfig : devCookieConfig


const login = async (req:Request, res:Response) => {
    try{
        const {email, password} = req.body
        if(!email || !password){
            res.status(400).json({status:'400', log:'please fill in all details'})
            return
        }
        const user = await User.findOne({email})
        if(user){
            // compare password
            const passwordMatch = await bcrypt.compare(password, user.password)
            if(passwordMatch){
                // set cookie 
                res.cookie("user", getToken(user._id), {
                    maxAge: OneDayInSec * 1000,
                    ...cookieConfig,
                });
                user.password = undefined
                res.status(200).json({status:'200', log:'user successfully logged in', user})
            }else{
                res.status(400).json({status:'400', log:'incorrect credentials'})
            }
        }else{
            res.status(404).json({status:'404', log:'User not found'})
        } 
    }catch(e){
        console.error(e)
        res.status(500).json({status:'500', log:'Server error, try again later'})
    }
    
}

const register = async (req:Request, res:Response) => {
    try{
        const {name, email, password} = req.body
        if(!name || !email || !password){
            res.status(400).json({status:'400', log:'please fill in all details'})
            return
        }
        const user = new User({name, email, password})
        await user.save()
        res.status(200).json({status:'200', log:'User successfully registered'})
    }catch(e){
        console.error(e)
        // if error code is 1101 then duplicate error or validation error
        if(e.code === 11000){
            res.status(400).json({status:'400', log:'Account with this email, already exists'})
            return
        }
        // validation error
        if(e._message){
            res.status(400).json({status:'400', log:e._message})
            return
        }
        res.status(500).json({status:'500', log:'Server error, try again later'})
    }
}

const currentUser = (req:Request, res:Response) => {
    // @ts-ignore
    const {user} = req
    res.status(200).json({status:'200', log:'current user info', user})
}
const logout = (req:Request, res:Response) => {
    res.clearCookie('user')
    res.status(200).json({status:'200',log:'user logged out'})
}
export {
    login,
    register,
    currentUser,
    logout
}