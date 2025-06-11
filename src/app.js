const express  = require("express");

const app = express();

app.use("/test",(req, res)=>{
    
    res.send("For Testing purpose.");

});

app.use("/happy",(req, res)=>{
    
    res.send("Happy Happy.");

});


app.use("/",(req, res)=>{
    
    res.end("Hello and Namaste.");

});


app.listen(3000, ()=>{
console.log("Hello from the server");
} 
);