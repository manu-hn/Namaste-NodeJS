const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 3,
        maxLength : 35
    },
    lastName : {
        type : String
    },
    mobileNumber : {
        type : String,
        minLength : 10,
        maxLength : 10,
        required : true,
        unique : true
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please fill a valid email address"]
    },
    password : {
        type : String,
        minLength : 8,
        maxLength : 128,
        required : true
    },
    gender : {
        type : String,
        default : "others",
        validate : {
            validator: (value)=>{
                if(!["male","female", "others"].includes(value)){
                    return false;
                }
            },
            message : "Gender must be male, female, or others"
        },
    
    },
    age : {
        type : Number,
        default : 18,
        min : 18,
        max : 120
    },
    interests : {
        type : [String]
    }
},
{
    timestamps : true
});

const User = model("user", userSchema);
module.exports = User;