import {Request, Response} from 'express'
import Team from '../models/team'
import User from '../models/user'

const getTeams = async (req:Request, res:Response) => {
    // get the user object from isAuthenticated middleware
    // @ts-ignore
    const {user} = req;
    res.status(200).json({status:'200', log:'teams of user', teams:user.teams})
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
        // if team created successfully updated creator profile
        const user = await User.findOne({_id : creator})
        user.teams.push(doc._id)
        await user.save()
        res.status(200).json({status:'200', log:'Team created successfully', teamId : doc._id})
    }catch(e){
        console.error(e)
        res.status(500).json({status:'500', log:'server error, try again later'})
    }
}

export {
    getTeams,
    createTeam
}