const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'please add name']
    },
    email: {
      type: String,
      required:[true,'please add email'],
      unique:true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    role: {
        type:String,
        enum:['publisher','user'],
        default:'user'
    },
     password:{
        type:String,
        required:[true,'please add password'],
        minlength:6,
        select:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save',async function(next){

    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.getSignedJwtToken = function() {
   return jwt.sign(
        { id:this._id },
          process.env.JWT_SECRET,
        { expiresIn:process.env.JWT_EXPIRE }
    )
}

userSchema.methods.comparePassword = function(enteredPassword) {
    return bcrypt.compare(enteredPassword,this.password);
}

userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 10*60*1000;
    return resetToken;

}

module.exports = mongoose.model('User',userSchema);