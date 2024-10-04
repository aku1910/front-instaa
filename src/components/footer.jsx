import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../image/logo.png';
import Search from "./search";
import { useDispatch } from 'react-redux';
import { setUser } from "../slices/user.slice";
import { useState } from 'react';
import Loader from "./loader";
import more from "../image/more.png"
import home from "../image/home.png"
import search from "../image/search.png"
import social from "../image/social.png"
import reel from "../image/reel.png"
import messenger from "../image/messenger.png"
import heart from "../image/heart.png"
import profilepic from "../image/profilepic.png"
import { RiLogoutBoxRLine } from "react-icons/ri";

export default function Footer() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);

        const response = await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.removeItem("user");
            dispatch(setUser(null));
            setTimeout(() => {
                setLoading(false);
                navigate("/auth/signin");
            }, 1000);
        }

        if (!response.ok) {
            console.log(`error: ${data.error}`);
            setLoading(false);
        }
    };

    return (
        <footer className='bg-zinc-50 border-t border-gray-300 fixed bottom-0 w-full sm:hidden'>
            <div className='h-[60px] flex items-center justify-around container mx-auto'>
                <nav className='flex items-center justify-around w-full'>
                    <NavLink to="/" className='flex-1 text-center'>
                        <img className='h-[16px] sm:h-[22px] mx-auto' src={home} alt="Home" />
                    </NavLink>
                    <NavLink to="/Chat" className='flex-1 text-center'>
                        <img className='h-[16px] sm:h-[22px] mx-auto' src={messenger} alt="Messenger" />
                    </NavLink>
                    <NavLink to="/createPost" className='flex-1 text-center'>
                        <img className='h-[16px] sm:h-[22px] mx-auto' src={more} alt="More" />
                    </NavLink>
                    <NavLink to="/" className='flex-1 text-center'>
                        <img className='h-[16px] sm:h-[22px] mx-auto' src={social} alt="Social" />
                    </NavLink>
                    <NavLink to='/Profile' className='flex-1 text-center'>
                        <img className='h-[16px] sm:h-[22px] rounded-full mx-auto' src={profilepic} alt="Profile" />
                    </NavLink>
                    {loading ? (
                        <Loader />
                    ) : (
                        <Link to="#" onClick={handleLogout} className='flex-1 text-center text-[16px] sm:text-[21px]'>
                            <RiLogoutBoxRLine className='inline-block' />
                        </Link>
                    )}
                </nav>
            </div>
        </footer>
    );
}
