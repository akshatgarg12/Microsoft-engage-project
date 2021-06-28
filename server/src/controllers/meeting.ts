import { Request, Response } from 'express'
import Team from '../models/team'
import Meeting from '../models/meeting'

const createMeeting = async (req: Request, res: Response) => {
  try {
    // @ts-expect-error
    const { user } = req
    const { title, teamId } = req.body
    if (!user || !teamId || !title) {
      res.status(400).json({ status: '400', log: 'Bad request! Send all credentials' })
      return
    }
    const meet = new Meeting({ title, teamId, creator: user._id })
    const doc = await meet.save()
    await Team.updateOne({ _id: teamId }, { $push: { meeting: doc._id } })
    res.status(200).json({ status: '200', log: 'Meeting created successfully', meetingId: doc._id })
  } catch (e) {
    console.error(e)
    res.status(500).json({ status: '500', log: e.message })
  }
}

const getMeetings = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.body
    if (!teamId) {
      res.status(400).json({ status: '400', log: 'Bad request! Send all credentials' })
      return
    }
    const meetings = await Meeting.find({ teamId })
    res.status(200).json({ status: '200', log: 'Meetings fetched', meetings })
  } catch (e) {
    console.error(e)
    res.status(500).json({ status: '500', log: e.message })
  }
}

export {
  createMeeting,
  getMeetings
}
