const express = require("express");
const jwt = require('jsonwebtoken');
const { connectDB } = require("./config/db");
const UserModel = require("./model/user.model");
const cookieParser = require("cookie-parser");
const { validateUserData, encryptPassword, verifyPassword, generateToken } = require("./utils/helper");
const {userAuth} = require("./middlewares/auth")

const app = express();

app.use(express.json());
app.use(cookieParser());
app.post("/register", async (req, res) => {

  try {
    const isValid = validateUserData(req.body, res);

    if (!isValid) {
      res.status(400).json({ message: "Invalid User Data" });
      return;
    }
    const existingUser = await UserModel.findOne({ $or: [{ emailId: req.body.emailId }, { mobileNumber: req.body.mobileNumber }] });
    if (existingUser) {
      res.status(400).json({ error: true, statusCode: 400, message: "User with given emailId or mobileNumber already exists" });
      return;
    }

    const { firstName, lastName, password, emailId, mobileNumber, gender, age, interests } = req?.body;

    const encryptedPassword = await encryptPassword(password);

    const user = new UserModel({ firstName, lastName, password: encryptedPassword, emailId, mobileNumber, gender, age, interests });
    await user.save();

    res.status(201).json({ success: true, erroe: false, statusCode: 201, message: "User Registered Successfully", data: user });
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

app.post("/login", async (req, res) => {
  try {

    const { emailId, password } = req.body;
    const isUserExists = await UserModel.findOne({ emailId });
    if (!isUserExists) {
           throw new Error("Invalid Credentials"); 
    }
    const token = await generateToken(isUserExists?._id);
    const isPasswordValid = await verifyPassword(password, isUserExists.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
      
    }
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict', expires: new Date(Date.now() + 24 * 60 * 60 * 1000)  });
    res.status(200).json({ error: false, statusCode: 200, message: "Login Successfull" });
    return;

  } catch (error) {
    res.status(401).json({ error: true, statusCode: 500, message: "Login Failed " + error.message });
    return;
  }
});

app.get("/profile",userAuth, async (req, res) => {
  try {
    const user = req.user;  
    const {password, ...rest} = user._doc;
    res.status(200).json({ message: "Profile Fetched Successfully",data : rest });

  } catch (error) {
    throw new Error("ERROR FAILED ", + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const feed = await UserModel.find();
    res.status(200).json({ feed });
  } catch (error) {
    throw new Error("Register Failed ", + error.message);

  }
});


connectDB()
  .then(() => {

    console.log('Database Connected Successfully');
    app.listen(5000, () => {
      console.log('Server is running on PORT 5000');
    })
  })
  .catch((err) => { console.error("Error While COnnecting ", err) })
