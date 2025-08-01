import React, { useContext } from 'react'
import {AppContext} from '../context/AppContext'
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios' ;
import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom'

const Myappointment = () => {
  const {backendUrl,token,getDoctorsData} = useContext(AppContext);
  const [appointments,setappointments] = useState([])
  const [showAll, setShowAll] = useState(false)
  const navigate =useNavigate()

  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const slotDateFormat = (slotDate) =>{
    const dateArray =slotDate.split('_');
    return dateArray[0]+" "+months[Number(dateArray[1])]+" "+dateArray[2];
  }

  const getUserAppointment = async()=>{
    try{
      const {data}=await axios.get(backendUrl+'/api/user/appointments',{headers:{token}});
      if(data.success){
        setappointments(data.appointments.reverse());
      }
    }catch(error){
      console.log(error);
      toast.error(error.message);
    }
  }

  const cancelAppointment=async(appointmentId)=>{
    try{
      const {data}= await axios.post(backendUrl+'/api/user/cancel-appointment',{appointmentId},{headers:{token}});
      if(data.success){
        toast.success(data.message)
        getUserAppointment()
        getDoctorsData()
      }else{
        toast.error(data.message);
      }
    }catch(error){
      console.log(error);
      toast.error(error.message);
    }
  }

  const  initPay= (order)=>{
    const options = {
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      currency:order.currency,
      name:'Appointment Payment',
      description:'Appointment Payment',
      order_id:order.id,
      receipt:order.receipt,
      handler: async(response)=>{
        try{
          const {data}= await axios.post(backendUrl+'/api/user/verifyRazorpay',{response},{headers:{token}});
          if(data.success){
            getUserAppointment();
            navigate('/my-appointment');
          }
        }catch(error){
          console.log(error);
          toast.error(error.message);
        }
      }
    }
    const rzp=new window.Razorpay(options)
    rzp.open();
  }

  const appointmentRazorPay = async (appointmentId)=>{
    try{
      const {data}= await axios.post(backendUrl+'/api/user/payment-razorpay',{appointmentId},{headers:{token}});

      if(data.success){
        initPay(data.order);

      }

    }catch(error){
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    if(token){
      getUserAppointment()
    }
  },[token])

  return (
    <div>
      <p className='pb-3 font-medium text-zinc-700 border-b border-zinc-300'>My Appointment</p>
      <div>
        {(showAll ? appointments :
          appointments.slice(0,3)).map((item,index)=>(
            <div className='grid grid-cols-[1fr_2fr]  gap-4 sm:flex sm:gap-6 py-2 border-b border-zinc-300' key={index}>
              <div>
                <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time: </span>{slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && item.payment && !item.isCompleted &&<button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
                {!item.cancelled && !item.payment && !item.isCompleted &&<button onClick={()=>appointmentRazorPay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300'>Pay Online</button>}
                {!item.cancelled && !item.isCompleted && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>}
                {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 ' >Appointment Cancelled</button> }
                {item.isCompleted  && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}
              </div>
            </div>
          ))
        }
        {appointments.length > 3 && (
          <div className="flex justify-center mt-10">
            <button
              className="mt-4 px-4 py-2  rounded bg-indigo-50 text-indigo-700 hover:border hover:bg-indigo-100 transition-all duration-100 font-semibold"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Recent Appointments" : "See All Appointments"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Myappointment