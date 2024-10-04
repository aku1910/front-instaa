
import Loader from 'components/loader';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { setAdmin } from 'slices/admin.slice';
import { MdOutlineAdminPanelSettings } from "react-icons/md";

const AdminLogin = () => {
  const [show, setShow] = useState(false);
  const [inputType, setInputType] = useState('password');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setInputType(show ? 'text' : 'password');
  }, [show]);


  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailRef = useRef();
  const passwordRef = useRef();


  const handleSubmit = async (event) => {
    setLoading(true);

    event.preventDefault();

    const emailValue = emailRef.current.value.trim();
    const passwordValue = passwordRef.current.value.trim();

    if (!emailValue || !passwordValue) {
      alert('Please fill up all fields');
      return;
    }

    try {
      const response = await fetch('/api/admin/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: passwordValue, email: emailValue }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.log('Server error:', errorMessage);
        setLoading(false);
      } else {
        const data = await response.json();
        localStorage.setItem('admin', JSON.stringify(data));
        dispatch(setAdmin(data));
        setTimeout(() => {
          setLoading(false);
          navigate('/Admin');
        }, 1000);
      }

    } catch (error) {
      console.error('Error during sign in:', error);
      setLoading(false);

    }
  };
    

  return (
    <div className='adminbg'>

    <div >
      <div className='flex justify-center'>
      <form className="grid gap-y-2  mt-[15%]">
        <div className='text-[50px] text-zinc-100 flex justify-center mb-[20px]'>
        <MdOutlineAdminPanelSettings />

        </div>
            <label className="relative w-[250px] flex bg-zinc-50 border focus-within:border-gray-400 rounded-sm">
              <input
                required={true}
                className="px-2 bg-transparent outline:none w-full h-[38px] text-xs valid:pt-[10px] peer"
                ref={emailRef}
                type="text"
                />
                  <span className="absolute top-1/2 left-[9px] cursor-text pointer-events-none text-xs text-gray-400 -translate-y-1/2 transition-all peer-valid:text-[10px] peer-valid:top-2.5">
                Username
              </span>
            </label>
            <label className="relative flex bg-zinc-50 border focus-within:border-gray-400 rounded-sm">
              <input
                required={true}
                className="bg-transparent px-2 outline:none w-full h-[38px] text-xs valid:pt-[10px] peer"
                ref={passwordRef}
                type={inputType}
                />
              <span className="absolute top-1/2 left-[9px] cursor-text pointer-events-none text-xs text-gray-400 -translate-y-1/2 transition-all peer-valid:text-[10px] peer-valid:top-2.5">
                Password
              </span>
              <div className="h-full select-none  flex cursor-pointer items-center text-sm font-semibold pr-2" onClick={() => setShow(!show)}>
                {show ? 'Hide' : 'Show'}
              </div>
            </label>
            {loading ? (
              <Loader />
            ) : (
              <button onClick={handleSubmit} className="w-[100%] mt-1 h-[30px] bg-brand font-semibold rounded text-white text-sm disabled:opacity-50" type="submit">
                Log In
              </button>


            )}
            </form>
      </div>
    </div>
                </div>
  );
}

export default AdminLogin;
