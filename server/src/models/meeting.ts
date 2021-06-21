import mongoose, { ObjectId } from 'mongoose'
const ObjectId = mongoose.Schema.Types.ObjectId

interface Meeting{
    title : string,
    createdAt : Date,
    creator : ObjectId,
    attendedBy : Array<ObjectId>,
}
interface inMeeting{
    socketId: string,
    userId: ObjectId
}
const inMeetingSchema = new mongoose.Schema<inMeeting>({
    socketId : {
        type:String,
        required:true
    },
    userId:{
        type:ObjectId,
        ref : 'User',
    }
})
const MeetingSchema = new mongoose.Schema<Meeting>({
   title:{
       type:String,
       required: [true, 'meeting title is required']
   },
   teamId:{
       type: ObjectId,
       ref : 'Team',
   },
   creator:{
       type: ObjectId,
       ref : 'User',
       required: [true, 'meeting must have a creator']
   },
   attendedBy : [{type : ObjectId, ref: 'User'}],
   inMeeting : {
       type : [inMeetingSchema],
       default: []
   },
   active:{
       type:Boolean,
       required: [true, 'meeting must have a state'],
       default : true
   }
},{
    timestamps:true
})

const Meeting = mongoose.model('Meeting', MeetingSchema)

export default Meeting