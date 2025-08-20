const express =  require("express");
const authRouter = express.Router();
const {validateSignupData} = require("../utils/validations");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");


authRouter.post("/signup",async(req, res)=>{
      try{
    
    validateSignupData(req);
    const {firstName, lastName, emailId, password} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
    }
    );
  
        await user.save();
    res.send("User added successfully.");
    }catch(err){
        res.status(400).send("Error saving the user:" + err.message);
    }
    
});

authRouter.post("/login", async(req, res)=>{
    try {
        const {emailId, password} = req.body;
    if(!validator.isEmail(emailId))
    {
        throw new Error("Email ID is not valid.");
    }    

    const user = await User.findOne({emailId: emailId});
    if(!user)
    {
        throw new Error("Invalid Credentials.");
    }
    const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid)        
    {
        const token = await user.getJWT();
        res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});
        res.status(200).send("Login Successful!!");
    }
    else{
        throw new Error("Invalid Credentials.");
    }
    } catch (error) {
        res.status(400).send("ERROR : "+ error.message);
    }
    

})

authRouter.post("/logout", async(req, res)=>{
    res.cookie("token", null , {expires : new Date(Date.now())});
    res.send("Logout Successful!!!!");
})



module.exports = authRouter;