import mongoose , { Schema, model } from "mongoose";


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


const User = model("User", userSchema);



export default User;