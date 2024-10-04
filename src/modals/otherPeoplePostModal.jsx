import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const PostModal = ({ isOpen, post, onClose }) => {
    const commentRef = useRef({});

    const sendComment = async (id) => {
        const commentValue = commentRef.current[id]?.value.trim();
        if (!commentValue) return;

        const response = await fetch(`/api/post/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment: commentValue }),
        });

        if (!response.ok) {
            console.log("Comment not sent");
        } else {
            alert("Comment successfully sent");
            commentRef.current[id].value = '';
        }
    };

    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded flex h-[500px] w-[500px] lg:h-[650px] lg:w-[1000px]">
                <div className="h-[500px] w-[500px] hidden sm:block lg:w-[650px] lg:h-[650px]">
                    <img src={`../${post.body}`} alt="Post" className="w-full h-full object-cover" />
                </div>
                <button className="absolute right-3 top-0 text-[30px] text-white" onClick={onClose}>x</button>
                <div className="w-auto flex flex-col">
                    <div className="flex items-center gap-2 p-4">
                        <img className="rounded-full w-[28px] h-[28px]" src={`../${post.postedBy.profilePic}`} alt="" />
                        <h1 className="text-[12px]">{post.postedBy.userName}</h1>
                    </div>
                    <hr />
                    <div className="p-4 overflow-y-scroll scrollbar-hidden flex-1">
                        {post.comments.map((comment, index) => (
                                <div className="flex items-center gap-2 mb-3">
                                    <img src={`../${comment.profilePic}`} className="w-[25px] h-[25px] rounded-full" alt="" />
                                    <div className="flex gap-1">
                                        <span className="font-bold text-[12px]">{comment.username}</span>
                                        <p className="text-gray-600 text-[12px]">{comment.comment}</p>
                                    </div>
                                </div>
                
                        ))}
                    </div>
                    <div className='grid justify-between'>
                        <div className='flex'>
                            <div>
                                <input type="text" placeholder='Add a comment...' ref={el => commentRef.current[post._id] = el} />
                            </div>
                            <div className='text-[18px]'>
                                <button className='text-gray-500' onClick={() => sendComment(post._id)}>Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostModal;
