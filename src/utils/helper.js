const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateUserData=(userData, res)=>{
const {firstName, lastName, emailId, mobileNumber, password} =userData;

if(!firstName || typeof firstName !== 'string' || firstName.length < 3 || firstName.length > 35){
   res.status(400).json({error : true, statusCode : 400, message: "Invalid First Name!, must be between 3 to 35 characters"});
   return false;
}
if(!lastName || typeof lastName !== 'string' || lastName.length < 3 || lastName.length > 35){
    res.status(400).json({error : true, statusCode : 400, message: "Invalid Last Name, must be between 3 to 35 characters"});
    return false;
}
if(!emailId || typeof emailId !== 'string' || !validator.isEmail(emailId)){
    res.status(400).json({error : true, statusCode : 400, message: "Invalid Email ID, please provide a valid email address"});
    return false;
}
if(!mobileNumber || typeof mobileNumber !== 'string' || mobileNumber.length !== 10 || !validator.isMobilePhone(mobileNumber)){
   res.status(400).json({error : true, statusCode : 400, message: "Invalid Mobile Number, please provide a valid 10 digit mobile number"});
   return false;
}
if(!password || typeof password !== 'string' || password.length < 8 || password.length > 15 || !validator.isStrongPassword(password)){
    res.status(400).json({error : true, statusCode : 400, message: "Invalid Password, password must be between 8 to 15 characters and include at least one uppercase letter, one lowercase letter, one number, and one symbol"});
    return false;
}
return true;

}



const encryptPassword= async(password)=>{
try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
    
} catch (error) {
    console.error(error)
}

}

const verifyPassword= async(password, hashedPassword)=>{
    try {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        return isPasswordValid;
        
    } catch (error) {
        console.error(error)
    }
}


const generateToken =async (userId)=>{
    try {
        const token =await jwt.sign({ _id: userId }, "M@nu123HN", { expiresIn: '1d' });
        return token;
    } catch (error) {
        console.error("Error While Generating Token  - ",error)
    }
}

module.exports={validateUserData,encryptPassword, verifyPassword, generateToken};