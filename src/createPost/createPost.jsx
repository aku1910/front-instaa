import React, { useRef, useState } from 'react';
import Header from 'components/header';
import { useNavigate } from 'react-router';
import { MdCreateNewFolder, MdDriveFolderUpload } from "react-icons/md";
import { Link } from 'react-router-dom';
import { TbArrowBigLeftFilled } from 'react-icons/tb';
import { MdOutlineFileUpload } from "react-icons/md";


const CreatePost = () => {
    const navigate = useNavigate();

    const bodyRef = useRef();
    const titleRef = useRef();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('postPic', bodyRef.current.files[0]);
        formData.append('title', titleRef.current.value.trim());

        try {
            const response = await fetch('/api/post/create', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.log('Server error:', errorMessage);
            } else {
                const data = await response.json();
                console.log(data);
                alert("Successfully created");
                navigate("/");
            }
        } catch (error) {
            console.error('Error during post creation:', error);
        }
    };

    return (
        <div className='instabg h-[100vh]'>
            <div className='flex justify-center'>
                <div className='bg-zinc-100 border w-[300px] sm:w-[500px] h-[375px] storybg mt-[10%]'>
                    <div className='text-[20px] absolute'>
                        <Link to="/"><TbArrowBigLeftFilled /></Link>
                    </div>
                    <div className="grid gap-y-3 ">
                        <div className="px-[40px] pt-8 pb-6">
                            <div className="flex justify-center mb-8">
                                <p className='font-semibold text-[30px] text-white'>Create Post</p>
                            </div>
                            <form className="grid gap-y-6 " onSubmit={handleSubmit}>
                                <div className='flex justify-center'>
                                <div>
                        <div className='flex justify-center'>
                        <div className=' w-[60px] h-[40px] text-white flex justify-center items-center bg-brand '>

                        <label htmlFor="update" className='text-[30px] cursor-pointer'>
                        <MdOutlineFileUpload />
                        </label>
                        </div>

                        </div>
                        <input
                            id='update'
                            className='hidden'
                            type="file"
                            ref={bodyRef}
                        />
                    </div>

                                </div>
                                <div className='flex justify-center'>
                                    <label className="relative flex bg-white border w-[200px] sm:w-[300px] focus-within:border-gray-400 rounded-sm">
                                        <input
                                            placeholder='Description'
                                            className="bg-transparent w-[200px] sm:w-[300px] px-2 outline:none  h-[38px] text-s valid:pt-[10px] peer"
                                            type='text'
                                            ref={titleRef}
                                        />
                                    </label>

                                </div>
                                <div className='flex justify-center'>
                                    <button type="submit" className='border bg-blue-500 w-[150px] h-[40px] text-white font-medium'>
                                        Post
                                    </button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
