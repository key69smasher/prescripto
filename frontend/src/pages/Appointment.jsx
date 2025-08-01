import React, { useContext, useState,useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import{AppContext} from '../context/AppContext'
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const {doctors,currencySymbol,backendUrl,token,getDoctorsData}=useContext(AppContext);
  const {docId}=useParams()
  const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  const navigate=useNavigate();
  const [doctor,setdoctor]=useState(null);
  const [docSlots,setDocSlots] = useState([])
  const [slotIndex,setSlotIndex]=useState(0);
  const [slotTime,setSlotTime]=useState('');
  
  const fillfun= async ()=>{
    const doctinfo=doctors.find(doc=>doc._id === docId)
    setdoctor(doctinfo);
  }

  const getAvailableSlots = async () => {
  if (!doctor) return;
  let allSlots = [];

  let today = new Date();

  for (let i = 0; i < 7; i++) {
    let currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    let endTime = new Date(today);
    endTime.setDate(today.getDate() + i);
    endTime.setHours(21, 0, 0, 0);

    if (today.getDate() === currentDate.getDate()) {
      // For today, skip past slots
      let now = new Date();
      let currentHour = now.getHours();
      let currentMinute = now.getMinutes();

      if (currentHour >= 21) continue; // No slots left today

      currentDate.setHours(currentHour >= 10 ? currentHour + 1 : 10);
      currentDate.setMinutes(currentMinute > 30 ? 30 : 0);
    } else {
      currentDate.setHours(10);
      currentDate.setMinutes(0);
    }

    let timeSlots = [];

    while (currentDate < endTime) {
      let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      let day = currentDate.getDate();
      let month= currentDate.getMonth()+1;
      let year =currentDate.getFullYear();

      const slotDate = day+"_"+month+"_"+year;
      const slotTime=formattedTime

      const isSlotAvailable= doctor.slots_booked[slotDate] &&  doctor.slots_booked[slotDate].includes(slotTime)?false:true;

      if(isSlotAvailable){
        timeSlots.push({
          datetime:new Date(currentDate),
          time:formattedTime
        })
      } 
      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

    allSlots.push(timeSlots);
  }

  setDocSlots(allSlots);
};


  const bookAppointment =async()=>{
    if(!token){
      toast.warn('login to book Appointment')
      return navigate('/login');
    }
    try{
      const date=docSlots[slotIndex][0].datetime
      let day = date.getDate();
      let month =date.getMonth()+1;
      let year = date.getFullYear();

      const slotDate =day+"_"+month+"_"+year
      const {data}= await axios.post(backendUrl+'/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}});
      if(data.success){
        toast.success(data.message);
        getDoctorsData();
        navigate('/my-appointment')
      }else{
        toast.error(data.message)
      }
    }catch(error){
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    fillfun()
  },[doctors,docId]);

  useEffect(()=>{
    getAvailableSlots()
  },[doctor])


  return doctor && (
    <div>
      {/* doctors Details */}
      <div className='flex felx-col sm:flex-row gap-4'>
        <div>
          <img className='bg-[var(--color-primary)] w-full sm:max-w-72 rounded-lg' src={doctor?.image} alt="" />
        </div>
        
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white  mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* doctor info */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900 '>
            {doctor.name} 
            <img className='w-5' src={assets.verified_icon} alt="" />
            </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{doctor.degree}-{doctor.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{doctor.experience}</button>
          </div>

          {/* Doctor About */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{doctor.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment Fee: <span className='text-gray-600'>{currencySymbol}{doctor.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item,index)=>(
              <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index? 'bg-[var(--color-primary)] text-white ' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item,index)=>(
            <p onClick={()=> setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime? 'bg-[var(--color-primary)] text-white':'text-gray-400 border border-gray-300'} `} key={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-[var(--color-primary)] text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>
      </div>
      {/* Listing related doctors */}
      <RelatedDoctors 
        docId={docId}
        speciality={doctor.speciality}
        />
    </div>
  )
}

export default Appointment