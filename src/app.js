const express  = require("express");
const connectDB = require("./config/database")
const app = express();
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRoute = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRoute);
app.use("/", requestRouter);


connectDB().then(()=>{
    console.log("Database connection established successfully..")
    app.listen(3000, ()=>{ 
        console.log("Hello from the server");
        } 
);
}).catch((err)=>{
    console.log("Database can not be connected!!")
})