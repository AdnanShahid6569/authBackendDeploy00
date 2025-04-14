import express from "express"
import { productData } from "./data.js";
import chalk from "chalk";
import mongoose from "mongoose";
import { postModel } from "./Schemas/Schema.js";
import bcrypt from 'bcrypt';
import { signupModel } from "./Schemas/UserSchema.js";
const app = express()
import cors from "cors";

const PORT = 4000;

app.use(express.json())   // Nodejs ko furcefully read karwaega body ko middleware
app.use(cors()) // ye browser ke pass jaega or backend ko frontend se connect karega kisi bhi 

const Db_URL = "mongodb+srv://Adnan:Mongos123@cluster0.jscsb.mongodb.net/"

mongoose.connect(Db_URL)

mongoose.connection.on("connected", () => {
    console.log("mongodb connect successfully..");
  });
  
  mongoose.connection.on("error", (err) => {
    console.log(err);
  });

app.get('/',(req,res)=>{
    res.send("GET METHOD SUCESS")
})

app.post("/post",(req,res)=>{
    console.log(req.body);    
    res.send("POST METHOD SUCESS")
    
})

// app.get("/product",(req,res)=>{
//     res.send(productData)
// })

// app.get('/product/:id',(req,res)=>{
//     const {id} = req.params
//     let filterData = productData.filter((e,i) => { return i == id})
//     res.send(filterData)
// })

// app.get('/product',(req,res)=>{
//     const {id} = req.query;

//     console.log(id);

//     if(id){
//         const filterData = productData.filter((e,i)=>{
//                     return e.id == id
//                 })
            
//                 res.send(filterData);
//     }
//     res.send(productData)
    
// })


// Database Mongodb Practice 
// post Data mongodb
// app.post('/createPost',(req,res)=>{

//   const {title,desc} = req.body;

//   if(!title || !desc){
//     res.status(400).json({
//       message:"Required Fields are missing.."
//     })
//   }
  
//   let obj = {
//     title,desc
//   }

//   const saveData = postModel.create(obj)
  
//   res.status(200).json({
//     message:"Post Sucessfully..",
//     saveData
//   })

// })

// // get Data Mongodb

// app.get("/getData",async(req,res)=>{
//   try {
//         const getDatas = await postModel.find({});
    
//         res.status(200).json({
//           message: "get post successful",
//           getDatas,
//         });
//       } catch (error) {
//         console.log(error);
//       }
  
// })

// // Update Data api help with Database
// app.put("/updateData",async(req,res)=>{
//   const {postid,title,desc} = req.body;
  
//   let updateobj={
//     title,desc
//   }
//    await postModel.findByIdAndUpdate(postid,updateobj)
//   res.status(200).json({
//     message: "get post successful",
//   });
// })



// SignUp api

app.post("/signupData", async(req,res)=>{
try {
  
  const {firstname,lastname,email,password} = req.body;
  
  if(!firstname ||!lastname || !email ||!password){
    
    return res.status(400).json({
      message:"Required fields are missings"
    })
  }

  const emailExist = await signupModel.findOne({email})

  if(emailExist !== null){
   return res.status(404).json({
      message:"Email already Exist"
    })
  }

  const encryptPassword =await bcrypt.hash(password,10)

  let userData ={
    firstname,lastname,email,
    password:encryptPassword
  }  

  const dataSave = await signupModel.create(userData)

res.status(200).json({
  message:"SignUp Sucessfully",
  dataSave
})
} 
catch (error) {
  console.log(error);
  
  res.status(500).json({
    message:"Internal Client Error"
  })
}
})


app.get("/getDatasss",async(req,res)=>{
  const ajadata =await signupModel.find({})
  
  res.status(200).json({
    message:"suceess",ajadata
  })
})


// login api

app.post("/loginData",async(req,res)=>{
  try {
    const {email,password} = req.body;
    if(!email ||!password){
    return res.status(404).json({
        message:"Required Fields Are Missing"
      })
    }

    const emailExist =await signupModel.findOne({email})

    if(!emailExist){
      return res.status(404).json({
        message:"Invalid Password and email"
      })
    }
    const comparePassword = await bcrypt.compare(password, emailExist.password);
    
    if(!comparePassword){
      return res.status(401).json({
        message:"Invalid Password"
      })
    }
    res.status(200).json({
      message:"Login Sucessfully"
    })
  } catch (error) {
    console.log(error);
    
  }
})
app.listen(PORT,()=>{
    console.log(chalk.underline.white(`Server Create http:localhost:${PORT}`));   
})