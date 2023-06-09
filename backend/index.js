const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const cors = require("cors")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const LoginDatas = require("../backend/models/LoginModael")


const app = express()
app.use(express.json())
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3001" }))


const salt = bcrypt.genSaltSync(5);
const secretkey = "hdjdfgkk485739dnf"

const DB = "mongodb+srv://madhumathilabglo:DxW0KBmeLXMJGVRg@cluster0.51neene.mongodb.net/express?retryWrites=true&w=majority"

mongoose.connect(DB).then(()=>{
    console.log("connected successfully")
}).catch(()=>{
    console.log("connection failed")
})

// if (process.env.NODE_ENV === "production") {
//     const path = require("path");
//     app.use(express.static(path.resolve(__dirname, 'client', 'build')));
//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'),function (err) {
//             if(err) {
//                 res.status(500).send(err)
//             }
//         });
//     })
// }

app.get("/",(req,res)=>{
    res.send("server Running")
})

app.post("/register",async(req,res)=>{
    const {name,email,password,age,dob,city,isAdmin}=req.body
    console.log("name",name,email,password,age,dob,city)
    try{
        const registerData = await LoginDatas.create({
            name,
            email,
            password:bcrypt.hashSync(password,salt),
            age,
            dob,
            city,
            isAdmin
        })
        console.log(registerData,"data")
        if(registerData){
            res.status(200).json({successmessage:"Employee Added Successfully"})

        }
        
    }
    catch(e){
        if(name === undefined || email === undefined || password === undefined || age === undefined || dob === undefined || city === undefined){
            res.status(400).json({message:"This field is required"})
        }
        else{
            res.status(400).json({errormessage:`this employee already exits`})
        }
    
    }
})

app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
      const userDoc = await LoginDatas.findOne({ email: email });
      console.log(userDoc)
      if(email === "" && password === "" ){
        res.status(400).json({email:"This field is required",password:"This field is required"})
      }
      else if(email === "" ||password === ""){
        res.status(400).json({message:"This field is required"})
      }
      else if(userDoc) {
        const passOk=bcrypt.compareSync(password,userDoc.password)
        if(passOk) {
          jwt.sign({email,_id:userDoc._id},secretkey,{},(err,token)=>{
            if(err) throw err;
            res.send({"token":token,"data":userDoc})
          })
        }
        else{
          res.status(400).json({message:"wrong credentials"});
        }

      } else {
        res.status(400).json({message:"Invalid email or password"})
      }

    
    }
      catch (e) {
       
        res.status(400).json(`Error In Login -> ${e}`)
      }
  })

  
app.get("/employees",async(req,res)=>{
    try{
        const employees = await LoginDatas.find({})
        if(employees){
            res.status(200).json(employees)
        }
        else{
         res.json({message:"can't get employees"})
        }
    }
    catch(e){
        res.status(400).json(e)
    }

})


app.put(`/employees/:id`,async(req,res)=>{
    try{
        const {name,email,password,age,dob,city}=req.body
        const employees =  await LoginDatas.findByIdAndUpdate(req.params.id,{
            name:name,
            email:email,
            password:password,
            age:age,
            dob:dob,
            city:city
        })
        if(employees){
            res.status(200).json({data:employees,message:"updated successfully"})
        }
    }
    catch(e){
        res.status(400).json(e)
    }
})

app.delete(`/employees/:id`,async(req,res)=>{
    try{
        const employees = await LoginDatas.findByIdAndDelete(req.params.id)
        if(employees){
            res.status(200).json({message:"Deleted successfully"})
        }
    }
    catch(e){
        res.status(400).json(e)
    }
})

PORT = 3000;
app.listen(PORT,()=>{
    console.log(`server Listening on port --> ${PORT} `);
})

