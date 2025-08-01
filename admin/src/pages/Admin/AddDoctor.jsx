import React, { useState, useContext, useRef } from 'react'
import { assets } from '../../assets/assets'
import {AdminContext} from '../../context/AdminContext'
import {toast} from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {
  const[docImg,setDocImg] = useState(false)
  const[name,setName]=useState('')
  const[email,setEmail]=useState('')
  const[password,setPassword]=useState('')
  const[experience,setExperience]=useState('1 Year')
  const[fees,setFees]=useState('')
  const[about,setAbout]=useState('')
  const[speciality,setSpeciality]=useState('General physician')
  const[degree,setDegree]=useState('')
  const[address1,setAddress1]=useState('')
  const[address2,setAddress2]=useState('')
  const [loading, setLoading] = useState(false);

  const scrollRef =useRef(null);

  const {backendUrl,aToken}=useContext(AdminContext);

  const onSubmitHandler = async(event)=>{
    event.preventDefault();
    try{
      if(!docImg){
        return toast.error('Image Not Selected')
      }
      setLoading(true);
      const formData = new FormData();
      formData.append('image',docImg)
      formData.append('name',name)
      formData.append('email',email)
      formData.append('password',password)
      formData.append('experience',experience)
      formData.append('fees',Number(fees))
      formData.append('about',about)
      formData.append('speciality',speciality)
      formData.append('degree',degree)
      formData.append('address',JSON.stringify({line1:address1,line2:address2}))
      
      // console log form data
      formData.forEach((value,key)=>{
        console.log(`${key}:${value}`);
      })

      const {data}=await axios.post(backendUrl+'/api/admin/add-doctor',formData,{headers: {aToken}})
      
      if(data.success){
        toast.success(data.message);
        setDocImg(false);
        setName('');
        setAbout('');
        setAddress1('');
        setAddress2('');
        setDegree('');
        setEmail('');
        setFees('');
        setPassword('');
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message);
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <form  className='m-5 w-full '>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>
      <div ref={scrollRef} className='bg-white px-8 py-8 border border-zinc-300 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll no-scrollbar'>
        <div className='flex items-center gap-4  mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg===false? assets.upload_area : URL.createObjectURL(docImg)} alt="" />
          </label>
          <input onChange={(e) => {if (e.target.files && e.target.files[0]) {setDocImg(e.target.files[0]);}}} type="file" id='doc-img' hidden />
          <p>Upload Doctor <br />picture</p>
        </div>

        {/* flex-1 means that at particular set breakpoint the flex-grow andd flex shrink become 1
         and flex-basis become zero */}
        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor name</p>
              <input onChange={(e)=>setName(e.target.value)} value={name} className=' pl-2 border border-zinc-300 rounded-px-3 py-2' type="text" placeholder='Name' required/>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor email</p>
              <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder='Email' className=' pl-2 border border-zinc-300 rounded-px-3 py-2' required/>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor password</p>
              <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)} value={password} className='pl-2 border border-zinc-300 rounded-px-3 py-2' required/>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select onChange={(e)=>setExperience(e.target.value)} value={experience} className='pl-1 border border-zinc-300 rounded-px-3 py-2' name="">
                <option value="1 Year" id="">1 Year</option>
                <option value="2 Year" id="">2 Year</option>
                <option value="3 Year" id="">3 Year</option>
                <option value="4 Year" id="">4 Year</option>
                <option value="5 Year" id="">5 Year</option>
                <option value="6 Year" id="">6 Year</option>
                <option value="7 Year" id="">7 Year</option>
                <option value="8 Year" id="">8 Year</option>
                <option value="9 Year" id="">9 Year</option>
                <option value="10 Year" id="">10 Year</option>
              </select>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Fees</p>
              <input onChange={(e)=>setFees(e.target.value)} value={fees} className=' border border-zinc-300 rounded-px-3 py-2 pl-2' type="number" placeholder='Fees' required/>
            </div>
          </div>
          
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} className='pl-1 border border-zinc-300 rounded-px-3 py-2' name="" >
                <option value="General Physician">General Physician</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input onChange={(e)=>setDegree(e.target.value)} value={degree} className='pl-2 border border-zinc-300 rounded-px-3 py-2' type="text" placeholder='Education' required/>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input onChange={(e)=>setAddress1(e.target.value)} value={address1} className='pl-2 border border-zinc-300 rounded-px-3 py-2' type="text" placeholder='Address 1' required/>
              <input onChange={(e)=>setAddress2(e.target.value)} value={address2} className='pl-2 border border-zinc-300 rounded-px-3 py-2' type="text" placeholder='Address 2' required/>
            </div>
          </div>
        </div>
        <div>
            <p className='mt-4 mb-2'>About Doctor</p>
            <textarea onChange={(e)=>setAbout(e.target.value)} value={about} className='w-full pt-2 px-4 border border-zinc-300 rounded' placeholder='write about doctor' rows={5} required/>
        </div>
        <button type='submit'  onClick={onSubmitHandler} className={`hover:bg-[var(--color-primary)] border border-black hover:border-[var(--color-primary)] hover:text-white rounded-full py-3 px-10 mt-4 bg-white text-black transition-all duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`} >{loading ? 'Adding...' : 'Add doctor'}</button>

      </div>
    </form>
  )
}

export default AddDoctor