import mongoose, { ObjectId } from 'mongoose'
const ObjectId = mongoose.Schema.Types.ObjectId

interface Meeting{
    title : string,
    createdAt : Date,
    creator : ObjectId,
    attendedBy : Array<ObjectId>,
}

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
   inMeeting : [{type : ObjectId, ref: 'User'}],
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