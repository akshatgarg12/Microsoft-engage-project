import mongoose, { ObjectId } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
const ObjectId = mongoose.Schema.Types.ObjectId

interface User{
  name: string
  email: string
  password: string
  teams: ObjectId[]
}

const UserSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: [true, 'User name required'],
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'User email required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'invalid email',
      isAsync: false
    }
  },
  password: {
    type: String,
    required: [true, 'User password required']
  },
  teams: {
    type: [{ type: ObjectId, ref: 'Team' }],
    default: []
  }
})

const SALT_WORK_FACTOR = 9

UserSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) return next()
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err != null) return next(err)
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err != null) return next(err)
      user.password = hash
      next()
    })
  })
})

const User = mongoose.model('User', UserSchema)

export default User
