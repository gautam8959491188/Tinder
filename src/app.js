const express  = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
app.use(express.json());

app.post("/signup",async(req, res)=>{
    const user = new User(req.body);
    try{
        await user.save();
    res.send("User added successfully.");
    }catch(err){
        res.status(400).send("Error saving the user:" + err.message);
    }
    
});

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

connectDB().then(()=>{
    console.log("Database connection established successfully..")
    app.listen(3000, ()=>{ 
        console.log("Hello from the server");
        } 
);
}).catch((err)=>{
    console.log("Database can not be connected!!")
})

