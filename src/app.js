const express  = require("express");

const app = express();

app.get("/user",(req, res)=>{
    res.send("User data fetched.");
})

app.post("/user",(req, res)=>{
    //Code to save data of user
    res.send("User data saved successfully");
})

app.delete("/user",(req, res)=>{
    res.send("User deleted successfully");
})


app.listen(3000, ()=>{
console.log("Hello from the server");
} 
);