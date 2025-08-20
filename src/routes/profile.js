const express = require("express");
const profileRouter = express.Router();
const {authUser} = require("../middlewares/authUser");
const {validateEditProfileData, validateEditPassword} = require("../utils/validations");

profileRouter.get("/profile/view",authUser, async(req, res)=>{
    try {
    const user = req.user;
    res.send(user);
        
    } catch (error) {
        res.status(400).send("ERROR: "+error.message);
        
    }

});

profileRouter.patch("/profile/edit", authUser, async(req, res)=>{
    try {
    if(!validateEditProfileData(req))
    {
        throw new Error("Invalid edit request.");
    }

    const loggedInUser = req.user;
    
    Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);

    console.log(loggedInUser);
    await loggedInUser.save();
    res.send({message: loggedInUser.firstName+" your profile has been updated successfully", data: loggedInUser})

    } catch (error) {
        res.status(400).send("ERROR: "+ error.message);
    }
    
})

profileRouter.patch("/profile/changePassword", authUser, async(req, res)=>{
    try {
    if(!validateEditPassword(req))
    {
        throw new Error("Invalid edit request.");
    }

    const loggedInUser = req.user;
    
    Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);

    console.log(loggedInUser);
    await loggedInUser.save();
    res.send({message: loggedInUser.firstName+" your profile has been updated successfully", data: loggedInUser})

    } catch (error) {
        res.status(400).send("ERROR: "+ error.message);
    }
    
})
module.exports = profileRouter;