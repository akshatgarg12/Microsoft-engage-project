import mongoose from 'mongoose'
import validator from 'validator'

interface User{
    name : string,
    email : string,
    password : string
}

const UserSchema = new mongoose.Schema<User>({
    name:{
        type:String,
        required: [true, 'User name required'],
        lowercase:true
    },
    email:{
        type:String,
        required: [true, 'User email required'],
        unique:true,
        lowercase:true,
        validate:{
            validator : validator.isEmail,
            message : 'invalid email',
            isAsync: false
        }
    },
    password:{
        type:String,
        required: [true, 'User password required'],
    },
})

const User = mongoose.model('User', UserSchema)

export default User