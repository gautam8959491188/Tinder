const jwt = require("jsonwebtoken");
const User = require("../models/user")
const authUser = async(req,res, next)=>{
    try {
        const {token} = req.cookies;
        if(!token)
        {
            throw new Error("Invalid token.");
        }
        const decodedObj = await jwt.verify(token, "DEV@TINDER$790");
        const {_id} = decodedObj;
        const user = await User.findById(_id);
        if(!user)
        {
            throw new Error("User not found.");

        }
        req.user = user;
        next()
    } catch (error) {
        res.status(400).send("ERROR: "+ error.message);
    }

}



module.exports = {
    authUser,
}