import mongoose, { ObjectId } from 'mongoose'
const ObjectId = mongoose.Schema.Types.ObjectId
interface Team{
    name : string,
    creator : ObjectId,
    members : Array<ObjectId>,
    meetings : Array<ObjectId>
}

const TeamSchema = new mongoose.Schema<Team>({
    name:{
        type:String,
        required: [true, 'team name is required']
    },
    creator:{
        type: ObjectId,
        ref : 'User',
        required: [true, 'team must have a creator']
    },
    members : [{type : ObjectId, ref: 'User'}],
    meeting : [{type : ObjectId, ref: 'Meeting'}],
}, {
    timestamps:true
})

const Team = mongoose.model('Team', TeamSchema)

export default Team