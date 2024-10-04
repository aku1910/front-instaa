import React, { useState, useRef, useEffect } from 'react';
import { RiFacebookBoxFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '../slices/user.slice';
import insta1 from '../image/screen1.png';
import insta2 from '../image/screenshot2.png';
import insta3 from '../image/screen3.png';
import insta4 from '../image/screen4.png';
import logo from '../image/logo.png';
import playmarket from '../image/playmarket.png';
import microsoft from '../image/microsoft.png';
import Loader from 'components/loader';
import { RiAdminLine } from "react-icons/ri";
import {auth,provider} from "../firebase.js"
import {signInWithPopup} from "firebase/auth"
import { FcGoogle } from "react-icons/fc";


const Login = () => {
  const [show, setShow] = useState(false);
  const [inputType, setInputType] = useState('password');
  const [loading, setLoading] = useState(false);


  const handleGoogleLogin = async () => {
   const data = await signInWithPopup(auth,provider)
  }

  useEffect(() => {
    setInputType(show ? 'text' : 'password');
  }, [show]);

  const ref = useRef();

  useEffect(() => {
    const images = ref.current.querySelectorAll('img');
    let total = images.length;
    let current = 0;

    const imageSlider = () => {
      images[(current > 0 ? current : total) - 1].classList.add('opacity-0');
      images[current].classList.remove('opacity-0');
      current = current === total - 1 ? 0 : current + 1;
    };

    imageSlider();
    let interval = setInterval(imageSlider, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [ref]);

  const emailRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      const response = await fetch('/api/auth/signin', {
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
        localStorage.setItem('user', JSON.stringify(data));
        dispatch(setUser(data));
        setTimeout(() => {
          setLoading(false);
          navigate('/');
        }, 1000);
      }

    } catch (error) {
      console.error('Error during sign in:', error);
      setLoading(false);

    }
  };

  return (
    <div className="h-full w-full flex items-center flex-wrap overflow-auto justify-center gap-x-8 mt-14">
      <Link to="/AdminLogin" className='absolute right-3 top-3 text-[20px]'>
      <RiAdminLine />
      </Link>
      <div className="hidden md:block w-[380px] h-[581px] relative my-auto bg-logo-pattern bg-[length:468.32px_634.15px] bg-[top_left_-46px]">
        <div className="absolute w-[250px] h-[541px] top-[27px] right-[17px]" ref={ref}>
          <img className="w-full h-full absolute top-0 left-0 opacity-0 duration-1000 ease-linear" src={insta1} alt="" />
          <img className="w-full h-full absolute top-0 left-0 opacity-0 duration-1000 ease-linear" src={insta2} alt="" />
          <img className="w-full h-full absolute top-0 left-0 opacity-0 duration-1000 ease-linear" src={insta3} alt="" />
          <img className="w-full h-full absolute top-0 left-0 opacity-0 duration-1000 ease-linear" src={insta4} alt="" />
        </div>
      </div>
      <div className="w-[350px] grid gap-y-3">
        <div className=" bg-white border px-[40px] pt-8 pb-6">
          <a className="flex justify-center mb-8" href="#">
            <img className="h-[51px] " src={logo} alt="" />
          </a>
          <form className="grid gap-y-1.5">
            <label className="relative flex bg-zinc-50 border focus-within:border-gray-400 rounded-sm">
              <input
                required={true}
                className="px-2 bg-transparent outline:none w-full h-[38px] text-xs valid:pt-[10px] peer"
                ref={emailRef}
                type="text"
              />
              <span className="absolute top-1/2 left-[9px] cursor-text pointer-events-none text-xs text-gray-400 -translate-y-1/2 transition-all peer-valid:text-[10px] peer-valid:top-2.5">
                Email
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
            <div className=" flex items-center my-2.5 mb-3.5">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="px-4 text-[13px] text-gray-500 font-semibold">OR</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>


            <Link to="/auth/resetpassword" className="text-xs flex items-center justify-center text-link">Forgot Password?</Link>

          </form>
        </div>
        <div className="bg-white p-4 text-sm text-center border">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="font-semibold text-brand">
            Sign up
          </Link>
        </div>
        <div className="flex justify-center text-sm">
          Get the app.
        </div>
        <div className="flex justify-center gap-2">
          <a href="#">
            <img className="h-[40px]" src={playmarket} alt="" />
          </a>
          <a href="#">
            <img className="h-[40px]" src={microsoft} alt="" />
          </a>

        </div>

      </div>
    </div>
  );
};

export default Login;
