import { Request, Response } from 'express'
import Meeting from '../models/meeting'
import Team from '../models/team'
import User from '../models/user'
import Chat from '../models/chat'

const getTeams = async (req: Request, res: Response) => {
  // get the user object from isAuthenticated middleware
  // @ts-expect-error
  const { user } = req
  const { teams } = user
  const records = await Team.find().populate('creator', 'name').where('_id').in(teams).exec()
  res.status(200).json({ status: '200', log: 'teams of user', teams: records })
}

const createTeam = async (req: Request, res: Response) => {
  try {
    const { name, members } = req.body
    // @ts-expect-error
    const creator = req.user._id
    // check if member in members exists or not
    const records = await User.find().select('_id').where('email').in(Array.from(members)).exec()
    const team = new Team({ name, creator, members: records })
    const doc = await team.save()
    const userIds = team.members.map((obj: any) => obj._id)
    // if team created successfully updated members profile
    await User.updateMany({ _id: { $in: userIds } }, { $push: { teams: doc._id } })

    res.status(200).json({ status: '200', log: 'Team created successfully', teamId: doc._id })
  } catch (e) {
    console.error(e)
    res.status(500).json({ status: '500', log: 'server error, try again later' })
  }
}

const getTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const team = await Team.findOne({ _id: id }).populate('members creator', 'name')
    if(!team){
      res.status(404).json({ status: '404', log: 'Team not found!'})
      return
    }
    const meetings = team.meeting
    const meetingDetails = await Meeting.find().where('_id').in(meetings).populate('creator attendedBy', 'name').exec()
    res.status(200).json({ status: '200', log: 'Team fetched successfully', team, meetings: meetingDetails })
  } catch (e) {
    console.error(e)
    res.status(500).json({ status: '500', log: 'server error, try again later' })
  }
}

const deleteTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.body
    const team = await Team.findOne({ _id: teamId })
    if(!team){
      res.status(404).json({ status: '404', log: 'Team not found!'})
      return
    }
    // @ts-ignore
    const userId = req.user._id
    // deny if not requested by the creator
    if(team.creator.toString() !== userId.toString()){
      res.status(403).json({ status: '403', log: 'Only the creator of team can delete it.'})
      return
    }
    // delete team from members model,
    const members = team.members
    await User.updateMany({_id : {$in : members}}, {$pull : {teams : teamId}})
    // delete chat related to the team,
    await Chat.deleteMany({teamId})
    // delete meetings of the team
    const meetings = team.meeting
    await Meeting.deleteMany({_id : {$in : meetings}})
    // delete team
    await Team.deleteOne({_id : teamId})
    res.status(200).json({ status: '200', log: 'Team data deleted successfully'})
  } catch (e) {
    console.error(e)
    res.status(500).json({ status: '500', log: e.message })
  }
}

const addMember = async (req: Request, res: Response) => {
  try {
    const {teamId, email} = req.body
    if(!teamId || !email){
      res.status(400).json({ status: '400', log: 'Please send all required parameters' })
      return
    }
    // check if this mail exists in team.
    const team = await Team.findOne({ _id: teamId }).populate('members', 'email')
    const alreadyMember = team.members.includes(email)
    if(alreadyMember){
      res.status(400).json({ status: '400', log: 'User is already a member' })
      return
    }
    // check if the user exists
    const user = await User.findOne({email})
    if(!user){
      res.status(404).json({ status: '404', log: "User doesn't exists" })
      return
    }
    // add the user id to the team member
    user.teams.push(teamId)
    await Team.updateOne({_id : teamId}, {$push : {members : user._id}})
    await user.save()
    res.status(200).json({ status: '200', log: 'user added to team successfully, refresh to update' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ status: '500', log: 'server error, try again later' })
  }
}

export {
  getTeams,
  createTeam,
  getTeam,
  deleteTeam,
  addMember
}
