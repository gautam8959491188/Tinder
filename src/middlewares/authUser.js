const authUser = (req, res, next)=>{
    console.log("User middleware called")
    const token = "xyz123";
    const authenticateToken = token === "xyz";
    if(!authenticateToken)
    {
        res.status(401).send("Unauthorized Call.")
    }
    else{
        next();
    }
}



module.exports = {
    authUser,
}