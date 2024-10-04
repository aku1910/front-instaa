import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewPass = () => {
    const newPasswordRef = useRef();
    const confirmPasswordRef = useRef();
    const navigate = useNavigate();

    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };

    const handlePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newPassword = newPasswordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        console.log('new password: ' + newPassword);
        console.log('confirm password: ' + confirmPassword);

        const emailString = localStorage.getItem('email');
        const email = emailString ? JSON.parse(emailString) : null;
        console.log('test email: ' + email);

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword, confirmPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            localStorage.removeItem('email');
            navigate('/auth/signin');
        } catch (error) {
            setError('Error resetting password');
            console.log('Error resetting password', error);
        }
    };

    return (
        <div className='flex justify-center'>
            <div className='h-[494px] w-[360px] border border-gray-200 mt-[9%] flex justify-center flex-col items-center text-center gap-y-5'>
                <div className='grid gap-y-2'>
                    <h1 className='font-bold'>Create A Strong Password</h1>
                    <p className='text-gray-400 text-sm'>
                        Your password must be at least 6 characters and should include a combination of numbers, letters and special characters (!$@%).
                    </p>
                </div>
                <form onSubmit={handleSubmit} className='flex flex-col gap-y-4'>
                    <label className='relative flex bg-zinc-50 border focus-within:border-gray-400 rounded-sm'>
                        <input
                            required
                            className='bg-transparent px-2 outline-none w-[225px] h-[45px] text-xs peer'
                            ref={newPasswordRef}
                            type={showPassword1 ? 'text' : 'password'}
                        />
                        <span className='absolute top-1/2 left-[9px] cursor-text pointer-events-none text-xs text-gray-400 -translate-y-1/2 transition-all peer-valid:text-[10px] peer-valid:top-2.5'>
                            New password
                        </span>
                        <div className='h-full select-none flex cursor-pointer items-center text-sm font-semibold pr-2' onClick={handlePasswordVisibility1}>
                            {showPassword1 ? 'Hide' : 'Show'}
                        </div>
                    </label>
                    <label className='relative flex bg-zinc-50 border focus-within:border-gray-400 rounded-sm'>
                        <input
                            required
                            className='w-[225px] h-[45px] bg-transparent px-2 outline-none text-xs peer'
                            ref={confirmPasswordRef}
                            type={showPassword2 ? 'text' : 'password'}
                        />
                        <span className='absolute top-1/2 left-[9px] cursor-text pointer-events-none text-xs text-gray-400 -translate-y-1/2 transition-all peer-valid:text-[10px] peer-valid:top-2.5'>
                            Confirm password
                        </span>
                        <div className='h-full select-none flex cursor-pointer items-center text-sm font-semibold pr-2' onClick={handlePasswordVisibility2}>
                            {showPassword2 ? 'Hide' : 'Show'}
                        </div>
                    </label>
                    {error && <p className='text-red-500 text-xs'>{error}</p>}
                    <button
                        type='submit'
                        className='bg-[#0095F6] text-white font-medium text-sm rounded-[10px] w-[267px] h-[44px] flex justify-center items-center'
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewPass;
