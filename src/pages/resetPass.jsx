import React, { useRef } from 'react';
import lock from "../image/lock.png";
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const ResetPass = () => {
  const emailRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = emailRef.current?.value;
    console.log('EMAIL TEST', email);
    if (!email) {
      return;
    }
    try {
      localStorage.setItem('email', JSON.stringify(email));
      const response = await fetch("/api/auth/forget", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      }
      )
      const data = await response.json()
      if (!response.ok) {
        console.log(data.error);
      }

    } catch (error) {
      console.log(error);
    }


  };

  return (
    <div className='flex justify-center'>
      <div className='flex justify-center mt-[100px] flex-col'>
        <div className='w-[388px] h-[491px] border border-gray-300 flex flex-col gap-y-3'>
          <div className='flex justify-center pt-6'>
            <img className='h-[96px]' src={lock} alt="" />
          </div>
          <div className='flex justify-center'>
            <p className='font-medium'>Trouble logging in?</p>
          </div>
          <div className='flex justify-center text-center text-sm text-gray-500'>
            <p>Enter your email, phone, or username and we'll <br /> send you a link to get back into your account.</p>
          </div>
          <div>
            <form onSubmit={(e) => { handleSubmit(e) }} className='flex flex-col justify-center items-center gap-y-3'>
              <label className="relative flex bg-zinc-50 border focus-within:border-gray-400 rounded-[10px]">
                <input
                  required={true}
                  className="px-2 bg-transparent rounded-[10px] outline-none w-[300px] h-[38px] text-xs valid:pt-[10px] peer"
                  ref={emailRef}
                  type="text"
                />
                <span className="absolute top-1/2 left-[9px] cursor-text pointer-events-none text-xs text-gray-400 -translate-y-1/2 transition-all peer-valid:text-[10px] peer-valid:top-2.5">
                  Email
                </span>
              </label>
              <button className="mt-1 h-[30px] w-[300px] bg-brand font-semibold rounded-[8px] text-white text-sm" type="submit">
                Send login link
              </button>
            </form>
            <div className="flex items-center my-[50px] ml-[44px] mb-3.5 w-[300px]">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="px-4 text-[13px] text-gray-500 font-semibold">OR</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
          </div>
          <div className='flex justify-center text-sm font-medium'>
            <Link to="/auth/signup">Create new account</Link>
          </div>
        </div>
        <div className='w-[388px] h-[44px] border bg-[#fafafa] text-sm font-medium flex justify-center items-center'>
          <Link to="/auth/signin">Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;
