import { Request ,  Response } from "express";
import Chat from '../models/chat'

const getChats = async (req:Request, res:Response) => {
    try{
        const {teamId} = req.body
        const chats = await Chat.find({teamId})
        res.status(200).json({status:'200', log:'Chats fetched successfully', chats})
    }catch(e){
        res.status(500).json({status:'500', log:e.message})
    }
}
const getMeetingChats = async (req:Request, res:Response) => {
    try{
        const {meetingId} = req.body
        const chats = await Chat.find({meetingId})
        res.status(200).json({status:'200', log:'Meeting Chats fetched successfully', chats})
    }catch(e){
        res.status(500).json({status:'500', log:e.message})
    }
}

export {
    getChats,
    getMeetingChats
}