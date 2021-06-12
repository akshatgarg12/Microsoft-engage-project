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
   creator:{
       type: ObjectId,
       ref : 'User',
       required: [true, 'meeting must have a creator']
   },
   attendedBy : [{type : ObjectId, ref: 'User'}],
},{
    timestamps:true
})

const Meeting = mongoose.model('Meeting', MeetingSchema)

export default Meeting