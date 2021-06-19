import mongoose, { ObjectId } from 'mongoose'
const ObjectId = mongoose.Schema.Types.ObjectId
import validator from 'validator'
import bcrypt from 'bcrypt'

interface User{
    name : string,
    email : string,
    password : string,
    teams : Array<ObjectId>
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
    teams:{
        type:[{type : ObjectId, ref: 'Team'}],
        default:[],
    }
})

const SALT_WORK_FACTOR = 9;

UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

const User = mongoose.model('User', UserSchema)

export default User