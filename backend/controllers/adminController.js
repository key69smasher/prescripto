import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as coludinary} from 'cloudinary'
import doctorModel from '../models/doctorModels.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointment Model.js'
import userModel from '../models/userModel.js'

// Api for adding doctor
const addDoctor=async(req,res)=>{
    try{
        const{name,email,password,speciality,degree,experience,about,fees,address}=req.body;
        const imageFile=req.file
        

        // checking for all data to add in the file
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false,message:"Missing Details"})
        }

        // validating emial format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter a  valid Email"})
        }

        // validating strong passwrod
        if(password.length<8){
            return res.json({success:false,message:"Enter a Strong Password"})
        }

        // hashing doctor password 
        const salt = await bcrypt.genSalt(10);
        const hashedpassword= await bcrypt.hash(password, salt);

        // uplload image to cloudinary
        const imageUpload= await coludinary.uploader.upload(imageFile.path,{resource_type_type:"image"});
        const imageUrl = imageUpload.secure_url

        const doctorData={
            name,
            email,
            image:imageUrl,
            password:hashedpassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor =new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:"true",message:"Doctor Added"})

    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}
// Api for admin login
const loginAdmin = async(req,res)=>{
    try{
        const email_admin=process.env.ADMIN_EMAIL
        const password_admin=process.env.ADMIN_PASSWORD
        const {email,password}=req.body
        if(email===email_admin && password===password_admin){
            const token=jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:'Invalid Admin Credentials'})
        }

    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Api to get all the doctors list for the admin panel
const allDoctors = async(req,res)=>{
    try{
        const doctors=await doctorModel.find({}).select('-password');
        res.json({success:true,doctors});
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Api to get all the appointments
const appointmentsAdmin =async(req,res)=>{
    try{
        const appointments =await appointmentModel.find({});
        res.json({success:true,appointments});
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Api for cancel the appointment
const appointmentCancel = async(req,res)=>{
    try{
        const {appointmentId}=req.body
        console.log(appointmentId)

        const appointmentData = await appointmentModel.findById(appointmentId);
        

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
        const {docId,slotDate,slotTime}=appointmentData;
        const doctorData=await doctorModel.findById(docId);
        let slots_booked=doctorData.slots_booked
        slots_booked[slotDate]=slots_booked[slotDate].filter(e=> e!==slotTime);
        await doctorModel.findByIdAndUpdate(docId,{slots_booked});
        res.json({success:true,message:"Appointment cancelled"})

    }catch{
        console.log(error);
        res.json({sucess:true,message:error.message});
    }
}

// Api for the dashboard data

const adminDashBoard =async(req,res)=>{
    try{

        const doctors =await doctorModel.find({});
        const users =await userModel.find({});
        const appointments =await appointmentModel.find({});
        
        const dasData={
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        res.json({success:true,dasData});

    }catch(error){
        console.log(error);
        res.json({sucess:true,message:error.message});
    }
}


export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashBoard}