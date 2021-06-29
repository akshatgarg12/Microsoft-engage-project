import chaiAsPromised from 'chai-as-promised'
import chai from 'chai'
import DatabaseConnection from '../config/mongodb'
import User from '../models/user'
import Team from '../models/team'
import Meeting from '../models/meeting'
import { before } from 'mocha'
chai.use(chaiAsPromised)
const { expect } = chai

describe('Database Test Suite', () => {
  before(async function () {
    await DatabaseConnection()
  })
  let userId: any = null
  let teamId: any = null
  let meetingId: any = null

  describe('User Test Suite', () => {
    it('creates a new user', async function () {
      const user = new User({ name: 'testuser', email: 'test@test.com', password: 'test123' })
      const doc = await user.save()
      userId = doc._id
    })
    it('storing invalid email', async function () {
      const user = new User({ name: 'x', email: 'foo', password: 'test' })
      await expect(user.save()).to.be.rejected
    })
    it('fetch user and check for password hashing', async function () {
      const user = await User.findOne({ _id: userId })
      expect(user.name).to.equal('testuser')
      expect(user.email).to.equal('test@test.com')
      expect(user.password).to.not.equal('test123')
    })
  })

  describe('Team Test Suite', () => {
    it('creates a new team', async function () {
      const team = new Team({ name: 'test-team', creator: userId })
      const doc = await team.save()
      teamId = doc._id
    })

    it('fetch team and check for members', async function () {
      const team = await Team.findOne({ _id: teamId })
      expect(team.name).to.equal('test-team')
      expect(String(team.creator)).to.equal(String(userId))
      expect(team.members).length(1)
      expect(String(team.members[0])).to.equal(String(userId))
    })
  })

  describe('Meeting Test Suite', () => {
    it('creates a new meeting', async function () {
      const meeting = new Meeting({ title: 'test-meet', creator: userId, teamId })
      const doc = await meeting.save()
      meetingId = doc._id
    })

    it('fetch meeting', async function () {
      const meeting = await Meeting.findOne({ _id: meetingId })
      expect(meeting.title).to.equal('test-meet')
      expect(String(meeting.creator)).to.equal(String(userId))
      expect(meeting.attendedBy).to.deep.equal([])
      expect(String(meeting.teamId)).to.equal(String(teamId))
    })
  })
  describe('Delete Entities', () => {
    it('deletes the user', async function () {
      await User.deleteOne({ _id: userId })
    })
    it('deletes the team', async function () {
      await Team.deleteOne({ _id: teamId })
    })
    it('deletes the meeting', async function () {
      await Meeting.deleteOne({ _id: meetingId })
    })
  })
})
