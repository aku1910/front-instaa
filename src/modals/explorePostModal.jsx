import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BsThreeDots } from 'react-icons/bs';
import { likePost, unlikePost, addPostComment, setPosts } from '../slices/post.slice';
import { FaHeart } from 'react-icons/fa';


const PostModal = ({ isOpen, post, onClose }) => {
    const commentRef = useRef({});
    const [dotsOpen, setDotsOpen] = useState(false);
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.user.user);

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
                method: 'POST',
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

    if (!isOpen || !post) return null;

    const isOwnPost = loggedInUser && String(loggedInUser.user._id) === String(post.postedBy._id);

    // Debugging logs
    console.log('loggedInUser:', loggedInUser);
    console.log('post.postedBy._id:', post.postedBy._id);
    console.log('isOwnPost:', isOwnPost);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <button className="absolute right-3 top-0 text-[30px] text-white" onClick={onClose} aria-label="Close modal">x</button>
            <div className="bg-white rounded flex h-[500px] w-[500px] lg:h-[650px] lg:w-[1000px] relative">
                <div className="h-[500px] w-[500px] hidden sm:block lg:w-[650px] lg:h-[650px]">
                    <img src={`../${post.body}`} alt="Post" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                    <div className='flex items-center justify-between'>
                        <Link to={`/peopleProfile/${post.postedBy._id}`}>
                            <div className='flex items-center p-4'>
                                <div className="flex items-center gap-2">
                                    <img className="rounded-full w-[28px] h-[28px]" src={post.postedBy.profilePic} alt={`${post.postedBy.userName}'s profile`} />
                                    <h1 className="text-[12px]">{post.postedBy.userName}</h1>
                                </div>
                            </div>
                        </Link>
                        {isOwnPost && (
                            <div className="relative">
                                <button onClick={() => setDotsOpen(!dotsOpen)} aria-label="More options">
                                    <BsThreeDots />
                                </button>
                                {dotsOpen && (
                                    <div className="absolute right-0 top-10 bg-white border border-gray-300 rounded shadow-md dots-menu">
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
                    <div className='flex justify-between p-4'>
                        <input type="text" placeholder='Add a comment...' ref={el => commentRef.current[post._id] = el} className="flex-1 border border-gray-300 rounded px-2 py-1" />
                        <button className='text-gray-500 ml-2' onClick={() => sendComment(post._id)}>Post</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostModal;
