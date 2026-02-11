import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import CustomError from '../handler/Error.util.js'
import { required } from "zod/mini";


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "must have at least three chars"],
        maxLength: [20, "not more then twenty chars"],
        trim: true,
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
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'password must be more at least eight chars']
    },
    userRole: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    refreshToken: [
        {
            token: { type: String },
            createdAt: { type: Date, default: Date.now() }
        }
    ],
    forgetPasswordToken: {
        type: String,
        default: null
    },
    forgetPasswordTokenExpire: {
        type: Date,
        default: null
    }
}, { timestamps: true })


userSchema.pre("save", async function () {
    try {
        if (!this.isModified("password")) return;
        this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
        return next(new CustomError(301, "failed to hash password"))
    }
})

userSchema.methods.comparePassword = async function (password) {
    const isPasswordCorrect = await bcrypt.compare(password, this.password);
    return isPasswordCorrect;
}

const User = model("User", userSchema);



export default User;