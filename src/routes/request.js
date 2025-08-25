const express = require("express");
const requestRouter = express.Router();
const {authUser} = require("../middlewares/authUser");
const ConnectionRequest = require("../models/connectRequest");
const User = require("../models/user");


requestRouter.post("/request/send/:status/:toUserId", authUser, async(req, res)=>{

    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status))
        {
            throw new Error("Invalid status type: "+ status);
        }
        const toUser = await User.findById(toUserId);
        if(!toUser)
        {
            throw new Error("User not found.");
        }
        
        const existingConnectionRequest = await ConnectionRequest.findOne({
           $or: [
            {fromUserId,toUserId},
            {fromUserId: toUserId, toUserId: fromUserId},   
           ]
        });

        if(existingConnectionRequest)
        {
            throw new Error("Connection request has been already present.");
        }

            const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status 
        })

        const data = await connectionRequest.save();
        res.json({message: req.user.firstName+` ${status} `+toUser.firstName, data});

    } catch (error) {
        res.status(400).send("ERROR: "+ error.message);
    }
})

module.exports = requestRouter;