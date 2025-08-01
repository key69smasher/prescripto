import React, { useState } from 'react'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Login = () => {
  const[state,setstate] = useState('Sign Up');
  const {backendUrl ,setToken,token}=useContext(AppContext)
  const navigate =useNavigate()
  const [email,setemail] = useState(''); 
  const [password,setpassword] = useState(''); 
  const [name,setName] = useState('');
  
  const onSubmitHandler = async(event) =>{
    event.preventDefault()

    try{
      if(state === "Sign Up"){
        const {data} = await axios.post(backendUrl+'/api/user/register',{name,password,email})
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token);
        }else{
          toast.error(data.message);
        }
      }else{
        const {data} = await axios.post(backendUrl+'/api/user/login',{password,email})
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token);
        }else{
          toast.error(data.message);
        }
      }

    }catch(error){
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-zinc-300  rounded-xl  text-zinc-600 text-sm shadow-lg '>
        <p className='text-2xl font-semibold'>{state==='Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state === 'Sign up' ? "sign up" :" Log in"} to book appointment </p>
        {
          state==="Sign Up"
          &&
          <div className='w-full'>
          <p>Full Name</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e)=>setName(e.target.value)} value={name} required/>
          </div>
        }
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e)=>setemail(e.target.value)} value={email} required/>
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="Password" onChange={(e)=>setpassword(e.target.value)} value={password} required/>
        </div>
        <button type='submit' className='bg-[var(--color-primary)] text-white w-full p-2 rounded-md text-base '>{state==='Sign Up' ? "Create Account" : "Login"}</button>
        {
          state==="Sign Up"
          ? <p>Already have an account?<span onClick={()=>setstate('Login')} className='text-[var(--color-primary)] underline cursor-pointer'> Login here</span></p>
          : <p>Create an new account? <span onClick={()=>setstate('Sign Up')} className='text-[var(--color-primary)] underline cursor-pointer'> Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login