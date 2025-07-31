const express  = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
app.use(express.json());
const {validateSignupData} = require("./utils/validations");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const jwt = require("jsonwebtoken");
const {authUser} = require("./middlewares/authUser");

app.post("/signup",async(req, res)=>{
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

app.post("/login", async(req, res)=>{
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
        console.log(token)
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

app.get("/profile",authUser, async(req, res)=>{
    try {
    const user = req.user;
    res.send(user);
        
    } catch (error) {
        res.status(400).send("ERROR: "+error.message);
        
    }

})

app.get("/feed",async (req, res)=>{
    try{
        const users = await User.find({});
        if(users.length === 0)
        {
            res.status(404).send("No User found.")
        }
        else{
            res.send(users);
        }

    }catch(err){
        res.status(400).send("Something went wrong.", err);
    }
})

app.get("/user",async(req, res)=>{
    const userEmail = req.body.emailId;
    try {
        const user = await User.findOne({emailId: userEmail});
        if(!user)
        {
            res.status(404).send("User not found");
        }
        else
        {
            res.send(user);
        }
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

app.delete("/user", async(req, res)=>{
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (error) {
        res.status(400).send("Something wend wrong");
    }
})

app.patch("/user/:userId",async(req, res)=>{
    const data = req.body;
    const userId = req.params?.userId;
    try { 
        const ALLOWED_UPDATES = [
            "photoURL", "about", "age", "gender", "skills"
        ]  

        const isUpdateAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed)
        {
            throw new Error("Update not allowed.");
        }

        if(data?.skills.length > 10){
            throw new Error("Skills cannot be more than 10");
        }
        const user = await User.findByIdAndUpdate({_id: userId},data,
             {returnDocument: "after",
               runValidators: true,}
            );
        
        res.send("User updated successfully.");
    } catch (error) {
        res.status(400).send("UPDATE FAILED: "+ error.message);
    }
})
connectDB().then(()=>{
    console.log("Database connection established successfully..")
    app.listen(3000, ()=>{ 
        console.log("Hello from the server");
        } 
);
}).catch((err)=>{
    console.log("Database can not be connected!!")
})