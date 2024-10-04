import React, { useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { addPostComment, setPosts } from '../slices/post.slice'

const PostModal = ({ isOpen, post, onClose }) => {
    const user = useSelector(state => state.user.user);
    const commentRef = useRef({});
    const [dotsOpen, setDotsOpen] = useState(false);
    const dispatch = useDispatch()
    const comments = useSelector(state => state.posts.comments)

    const renderedComments = comments ? comments : post?.comments


    const sendComment = async (id) => {
        const commentValue = commentRef.current[id]?.value.trim();

        if (!commentValue) return;

        try {
            const response = await fetch(`/api/post/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment: commentValue }),
            });

            if (!response.ok) throw new Error("Comment not sent");


            const data = await response.json();

            dispatch(addPostComment(data.data.comments))





            alert("Comment successfully sent");
            commentRef.current[id].value = '';
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deletePost = async (postId) => {
        try {
            const response = await fetch(`/api/post/posts/${postId}`, {
                method: 'POST', // Silme işlemi için DELETE metodunu kullanın
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) throw new Error('Failed to delete post');
    
            const result = await response.json();
            alert(result.msg);
    
            dispatch({ type: 'DELETE_POST', payload: postId });
            onClose();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };
    

    const toggleDots = () => setDotsOpen(prev => !prev);




    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded flex h-[500px] w-[500px] lg:h-[650px] lg:w-[1000px]">
                <div className="h-[100%] object-cover w-auto hidden sm:block ">
                    <img src={post.body} alt="Post" className="w-full h-full object-cover" />
                </div>
                <button className="absolute right-3 top-0 text-[30px] text-black" onClick={onClose}>x</button>
                <div className="w-[300px] flex flex-col">
                    <div className='flex justify-between items-center'>
                        <div className="flex items-center gap-2 p-4">
                            <img className="rounded-full w-[28px] h-[28px]" src={user.user.profilePic} alt="" />
                            <h1 className="text-[12px]">{user.user.userName}</h1>
                        </div>
                        {user && (
                            <div>
                                <button onClick={toggleDots} aria-label="More options"><BsThreeDots /></button>
                                {dotsOpen && (
                                    <div className="absolute bg-white border border-gray-300 rounded shadow-md">
                                        <button className="p-2 text-red-500" onClick={() => deletePost(post._id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <hr />
                    <div className="p-4 overflow-y-scroll scrollbar-hidden flex-1">

                        <div className="p-4 overflow-y-scroll scrollbar-hidden flex-1">
                            {renderedComments.map((comment) => (
                                <div key={comment._id} className="flex items-center gap-2 mb-3">
                                    <img src={comment.profilePic} className="w-[25px] h-[25px] rounded-full" alt="" />
                                    <span className="font-bold text-[12px]">{comment.username}</span>
                                    <div className="flex flex-col gap-1 max-w-[200px]">
                                        <p className="text-gray-600 text-[12px] break-words">{comment.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                    <div className=' grid justify-between '>
                        <div className='flex '>
                            <input
                                type="text"
                                placeholder='Add a comment...'
                                ref={el => commentRef.current[post._id] = el}
                            />
                            <button className='text-gray-500 text-[18px]' onClick={() => sendComment(post._id)}>Post</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostModal;


