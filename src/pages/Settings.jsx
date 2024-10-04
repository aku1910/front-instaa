import Header from 'components/header';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from 'slices/user.slice';
import { MdDriveFolderUpload } from "react-icons/md";


const ProfileUpdate = () => {
    const { register, handleSubmit, setValue } = useForm();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    // useEffect(() => {

    // const fetchUserData = async () => {
    //     try {
    //         const response = await fetch('/api/users/profile', {
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //             },
    //         });
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         const result = await response.json();

    //         // Set form values with fetched user data
    //         setValue('email', result.email);
    //         setValue('fullName', result.fullName);
    //         setValue('userName', result.userName);
    //     } catch (error) {
    //         console.error('Error fetching user data:', error);
    //     }
    // };

    //     fetchUserData();
    // }, [setValue]);

    console.log(user);

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('email', data.email);
            formData.append('fullName', data.fullName);
            formData.append('userName', data.userName);
            formData.append('password', data.password);
            if (file) {
                formData.append('profilePic', file);
            }

            console.log(data);

            const response = await fetch('/api/users/profile', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Profile updated successfully:', result);

            console.log(file);
            const newUser = {
                ...result,
                following: user.user.following,
                followers: user.user.followers,
            }
            // Update user state with the new data

            dispatch(setUser({ user: newUser }));
            localStorage.setItem("user", JSON.stringify({ user: newUser }))

            // Optionally update local storage or global state here if necessary

            // Navigate to profile page
            navigate('/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div>
            <Header />
            <div className='grid justify-center items-center mt-[8%]'>
                <h1 className='mb-[20px] border storybg text-white flex justify-center'>Update zone</h1>
                <form onSubmit={handleSubmit(onSubmit)} className='grid gap-y-3'>
                    <div>
                        <input
                            className='border bg-gray-100 h-[40px] w-[280px]'
                            placeholder='Email'
                            type="text"
                            {...register('email')}
                        />
                    </div>
                    <div>
                        <input
                            className='border bg-gray-100 h-[40px] w-[280px]'
                            placeholder='Full Name'
                            type="text"
                            {...register('fullName')}
                        />
                    </div>
                    <div>
                        <input
                            className='border bg-gray-100 h-[40px] w-[280px]'
                            placeholder='User Name'
                            type="text"
                            {...register('userName')}
                        />
                    </div>
                    <div>
                        <input
                            className='border bg-gray-100 h-[40px] w-[280px]'
                            placeholder='Password'
                            type="password"
                            {...register('password')}
                        />
                    </div>
                    <div>
                        <div className='flex justify-center'>
                        <div className=' w-[60px] h-[40px] text-white flex justify-center items-center bg-brand '>

                        <label htmlFor="update" className='text-[30px] cursor-pointer'>
                            <MdDriveFolderUpload />
                        </label>
                        </div>

                        </div>
                        <input
                            id='update'
                            className='hidden'
                            type="file"
                            onChange={handleFileChange}
                        />
                    </div>
                    <button type="submit" className='border storybg text-white h-[40px]' disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                    {error && <div className='text-red-500'>{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default ProfileUpdate;
