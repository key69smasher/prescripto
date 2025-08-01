import express from  'express'
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDasboard, doctorList, doctorProfile, loginDoctor, updateDoctorProfile } from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter =express.Router();

doctorRouter.get('/list',doctorList);
doctorRouter.post('/login',loginDoctor);
doctorRouter.post('/login',loginDoctor);
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel);
doctorRouter.get('/dashboard',authDoctor,doctorDasboard);
doctorRouter.get('/profile',authDoctor,doctorProfile);
doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile);
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete);
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor);

export default doctorRouter;

