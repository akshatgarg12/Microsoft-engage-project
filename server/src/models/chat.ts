import mongoose, { ObjectId } from 'mongoose'
const ObjectId = mongoose.Schema.Types.ObjectId
interface Chat{
  from: string
  message : string
  teamId : ObjectId
}

const ChatSchema = new mongoose.Schema<Chat>({
  from: {
    type: String,
    required: [true, 'sender name is required']
  },
  message: {
    type: String,
    required: [true, 'message data is required']
  },
  teamId : {
      type: ObjectId,
      ref : 'Team'
  }
}, {
  timestamps: true
})

const Chat = mongoose.model('Chat', ChatSchema)

export default Chat
