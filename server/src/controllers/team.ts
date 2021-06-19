import {Request, Response} from 'express'
import Team from '../models/team'
import User from '../models/user'


const getTeams = async (req:Request, res:Response) => {
    // get the user object from isAuthenticated middleware
    // @ts-ignore
    const {user} = req
    const {teams} = user
    const records = await Team.find().populate('creator', 'name').where('_id').in(teams).exec()
    res.status(200).json({status:'200', log:'teams of user', teams:records})
}

const createTeam = async (req:Request, res:Response) => {
    try{
        const {name, members} = req.body
        // @ts-ignore
        const creator = req.user._id
        // check if member in members exists or not
        const records = await User.find().select('_id').where('email').in(Array.from(members)).exec();
        const team = new Team({name, creator, members : records})
        const doc = await team.save()
        const userIds = team.members.map((obj:any) => obj._id)
        // if team created successfully updated members profile
        await User.updateMany({_id :  {$in : userIds}}, { $push : {teams : doc._id }})

        res.status(200).json({status:'200', log:'Team created successfully', teamId : doc._id})
    }catch(e){
        console.error(e)
        res.status(500).json({status:'500', log:'server error, try again later'})
    }
}

const getTeam = async (req:Request, res:Response) => {
    try{
        const {id} = req.params
        const team = await Team.findOne({_id : id}).populate('members creator', 'name')
        res.status(200).json({status:'200', log:'Team fetched successfully', team})
    }catch(e){
        console.error(e)
        res.status(500).json({status:'500', log:'server error, try again later'})
    }  
}
export {
    getTeams,
    createTeam,
    getTeam
}