const mongoose = require('mongoose');
const validator = require("validator");
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Email is not valid.");
            }
        }
    },
    password:{
        type: String,
        required: true,
        minLength:5,
        validate(value)
        {
            if(!validator.isStrongPassword(value))
            {
                throw new Error("Pick the strong password.");
            }
        }
    },
    age:{
        type: Number,
        min: 18,
    },
    gender:
    {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
            throw new Error("Gender data is not valid");
            }
        }
    },
    photoURL:{
        type: String,
        default: "https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg",
        validate(value){
            if(!validator.isURL(value))
            {
                throw new Error("Invalid photo URL.");
            }
        }
    },
    about:{
        type: String,
        default: "This is the default about section for users."
    },
    skills:{
        type: [String],
    }
},{
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
