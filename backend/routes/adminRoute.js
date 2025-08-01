import express from 'express'
import { addDoctor, adminDashBoard, allDoctors, appointmentCancel, appointmentsAdmin, loginAdmin } from '../controllers/adminController.js'
import {changeAvailability} from '../controllers/doctorController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js';

const adminRouter=express.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor);
adminRouter.post('/login',loginAdmin);
adminRouter.post('/all-doctors',authAdmin,allDoctors);
adminRouter.get('/appointments',authAdmin,appointmentsAdmin);
adminRouter.get('/dashboard',authAdmin,adminDashBoard);
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel);
adminRouter.post('/change-availability',authAdmin,changeAvailability);
export default adminRouter;