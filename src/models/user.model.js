import mongoose , { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import CustomError from '../handler/Error.util.js'


const userSchema =  new Schema({
    firstName: {
        type: String,
        require: true,
        minLength: [3, "must have at least three chars"],
        maxLengthe: [20, "not more then twenty chars"],
        turm: true,
    },
    lastName: {
        type: String,
        minLength: [3, "must have at least three chars"],
        maxLengthe: [20, "not more then twenty chars"],
        trim: true
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        minLength: [8, 'password must be more at least eight chars']
    }
},{timestamps: true})


userSchema.pre("save", async function(){
    try {
        if(!this.isModified("password")){
            return next();
        }
        this.password = await bcrypt.hash(this.password , 10);
    } catch (error) {
        return next(new CustomError(301, "failed to hash password"))
    }
})

userSchema.methods.comparePassword =async function (password){
  const isPasswordCorrect = await bcrypt.compare(password, this.password);
  return isPasswordCorrect;
}

const User = model("User", userSchema);



export default User;