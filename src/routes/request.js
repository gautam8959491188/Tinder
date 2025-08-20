const express = require("express");
const requestRouter = express.Router();
const {authUser} = require("../middlewares/authUser");

requestRouter.post("/sendConnectionRequest", authUser, async(req, res)=>{
    const user = req.user;
    console.log(user.firstName+" Sending connection request.")
    res.send("Connection Request Send.");
})

module.exports = requestRouter;