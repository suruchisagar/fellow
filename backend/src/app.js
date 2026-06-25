const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const feedRouter = require("./routes/feed");  


require("dotenv").config();

require("./utils/cronjob");

app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);
app.use("/", feedRouter);  


const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });












// const express = require('express');

// const app = express();

// const connectDB = require("./config/database");
// const User = require('./models/user');
// const {validateSignupData} = require('./utils/validation');
// const bcrypt = require('bcrypt');

// //this middleware will update for all the routes
// //as app.use(()=>{}) here there is no routes given so it will work for all the routes
// //express.json will convert req in json format for all routes and when we do req.body then 
// //it will give the same code which we have hardcoded below in the json format
// app.use(express.json());

// //signup route
// app.post('/signup', async(req,res)=>{

//     //validation of data
//     validateSignupData(req);
    
//     const {firstName, lastName, emailId, password}= req.body;

//     //hashing the password
//     const passwordHash = await bcrypt.hash(password, 10);
    

//     //creating a new instance of User(means creating a new user)

//     //hardcoding
//     // const user = new User({
//     //     firstName: "Suruchi",
//     //     lastName: "Sagar",
//     //     emailId: "sur@gmail.com",
//     //     password:"sur"
         
//     // });

//     const user = new User({
//         firstName,
//         lastName,
//         emailId,
//         password: passwordHash, 
//     });

//     //always wrap the db working in the try catch block
//     try{
//         //to save the details in the database
//         await user.save();

//         //sending the response from the server
//         res.send("User added successfully............")
//     }catch(err){
//         res.status(400).send("ERROR: "+ err.message);
//     }
// })

// //signin
// app.post('/login', async(req,res)=>{
//     try{
//         const {emailId, password}= req.body;

//         //check if the emailId is correct or not
//         const user= await User.findOne({emailId : emailId});
//         if(!user){
//             throw new Error("Invalid credentials");
//         }

//         const isPasswordValid= await bcrypt.compare(password, user.password);

//         if(isPasswordValid){
//             res.send("Login successful");
//         }else{
//             throw new Error("Invalid credentials");
//         }

//     }catch(err){
//         res.status(400).send("ERROR: "+err.message);
//     }
// })


// //get user by email
// app.get('/user',async(req, res)=>{
//     const userEmail = req.body.emailId;

//     try{
//         const users=await User.find({
//             emailId:userEmail
//         });
//         if(users.length === 0){
//             res.status(404).send("user not found");
//         }else{
//             res.send(users);
//         }
//         }catch(err){
//             res.status(400).send("Something went wrong");
//         }
// })

// //to get all users from database
// app.get('/feed', async(req,res)=>{

//     try{
//         const users = await User.find({});
//         res.send(users);
//     }catch(err){
//         res.status(400).send("Something went wrong");
//     }
    
// })

// //delete a user from the database
// app.delete('/delete', async(req,res)=>{
//     const userId = req.body.userId;
//     try{
//         const user = await User.findByIdAndDelete({_id: userId});
//         res.send("User deleted successfully...");
//     }catch(err){
//         res.status(400).send("Something went wrong");
//     }
// })

// //update a data of the user
// app.patch('/user/:userId', async(req,res)=>{
//     const userId = req.params?.userId;
//     const data = req.body;

    

//     try{
//         const ALLOWED_UPDATES =[
//         "photoURL", "about", "gender", "age", "skills"
//         ]

//         const isUpdateAllowed = Object.keys(data).every((k)=>
//             ALLOWED_UPDATES.includes(k)
//         )

//         if(!isUpdateAllowed){
//             throw new Error("Updates not allowed");
//         }

//         if(data.skills.length >10){
//             throw new Error("Skills cannot be more than 10");
//         }
//         const user = await User.findByIdAndUpdate({_id: userId}, data,{
//             returnDocument: "after",
//             runValidators: true,
//         }); //read more about findidandupdate you will get to know about the options and if we dont provide options then by default it will return the data before updates
//         res.send("user updated successfully......");
//     }catch(err){
//         res.status(400).send("update failed"+ err.message);
//     }
// })

// connectDB()
//    .then(()=>{
//     console.log("Database connection established...");
//     app.listen(3000, ()=>[
//     console.log("Server is successfully listening on port 3000")
//     ]);
//    })
//    .catch((err)=>{
//     console.error("Database cannot be connected......");
//    });

