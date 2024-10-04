import React, { useEffect, useRef, useState } from 'react';
import tate from "../image/atate.jpg";
import { BsThreeDots } from "react-icons/bs";
import send from "../image/send.png";
import save from "../image/save-instagram.png";
import comment from "../image/chat.png";
import { timeSince } from '../utils/utils';
import { FaHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, unlikePost } from '../post/postAction';
import { LuDelete } from "react-icons/lu";
import { Link } from 'react-router-dom';
import useSocket from 'hooks/useSocket';
import { setOnlineUsers } from 'slices/user.slice';

const Posts = () => {
    const dispatch = useDispatch();
    const [posts, setPosts] = useState([]);
    const commentRef = useRef({});
    const [showModal, setShowModal] = useState(false);
    const [modalComments, setModalComments] = useState([]);
    const [dotsOpen, setDotsOpen] = useState(false);
    const [commentValue, setComment] = useState("");
    const socket = useSocket();
    const loggedInUser = useSelector(state => state.user.user);
    const [currentPostId, setCurrentPostId] = useState(null);
    
    useEffect(() => {
        socket.on("getOnlineUsers", (userId) => {
            dispatch(setOnlineUsers(userId));
        });
        
        return () => socket.disconnect();
    }, [socket, dispatch]);

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
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };
    useEffect(() => {
        const getPosts = async () => {
            try {
                const response = await fetch('/api/post/following', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Server error');

                const data = await response.json();
                setPosts(data.posts);
            } catch (error) {
                console.error('Error during fetching posts:', error);
            }
        };

        getPosts();
    }, [showModal, commentValue, modalComments, loggedInUser , deletePost]);

    if (!loggedInUser) {
        return <div>Loading...</div>; // or any other fallback UI
    }

    const isOwnProfile = (postId) => {
        const post = posts.find(post => post._id === postId);
        return loggedInUser?.user._id === post?.postedBy._id;
    };

    const openModal = (postId) => {
        setCurrentPostId(postId);
        setDotsOpen(true);
    };

    const closeModal = () => {
        setDotsOpen(false);
    };

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

            alert("Comment successfully sent");
            commentRef.current[id].value = '';
            setComment(commentValue);
        } catch (error) {
            console.error("Error:", error);
        }
    };


    const toggleModal = (comments) => {
        setModalComments(comments);
        setShowModal(!showModal);
    };

    return (
        <div className='grid justify-center pb-6'>
            <div className='w-[300px] sm:w-[468px] h-auto border-b border-t bg-white'>
                <div className='pb-4 pt-4'>
                    {posts.map(post => (
                        <div key={post._id}>
                            <div className='flex h-[50px] w-[100%] justify-between items-center'>
                                <div className='w-[200px] flex items-center ml-[10px] mt-[10px] gap-3'>
                                    <Link to={`/peopleProfile/${post.postedBy._id}`}>
                                        <a className='flex items-center' href="">
                                            <img className='w-[40px] h-[40px] object-cover rounded-[50%] border' src={post.postedBy.profilePic} alt="" />
                                            <p className='font-semibold text-[14px] ml-[10px]'>{post.postedBy.userName}</p>
                                        </a>
                                    </Link>
                                    <p className='text-xs text-gray-500'>
                                        {timeSince(new Date(post.createdAt))}
                                    </p>
                                </div>
                                {isOwnProfile(post._id) && (
                                    <div>
                                        <button onClick={() => openModal(post._id)}>
                                            <BsThreeDots />
                                        </button>

                                        {dotsOpen && currentPostId === post._id && (
                                            <div>
                                                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                                                    <div className="bg-white p-4 rounded w-[250px] h-[70px] flex justify-center items-center relative">
                                                        <button
                                                            onClick={() => deletePost(post._id)}
                                                            className="text-black font-semibold text-[20px]"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    className="text-white fixed right-1 top-0 text-[25px]"
                                                    onClick={closeModal}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className='h-[400px] mt-[12px] object-cover'>
                                    <img className='w-[100%] h-[100%] object-cover' src={post.body} alt="" />
                                </div>
                            </div>
                            <div className='grid gap-y-2 mt-3'>
                                <div className='flex justify-between'>
                                    <div className='flex gap-4'>
                                        <button onClick={() => {
                                            const check = post.likes.find((x) => x === loggedInUser.user._id);
                                            if (check) {
                                                dispatch(unlikePost(post._id));
                                            }
                                            else {
                                                dispatch(likePost(post._id));
                                            }
                                        }} className='text-[22px]'>
                                            <FaHeart style={{ color: post.likes.find((x) => x === loggedInUser.user._id) ? "red" : "black" }} />
                                        </button>
                                        <button onClick={() => toggleModal(post.comments)} className='w-[22px]'>
                                            <img src={comment} alt="" />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <h6 className='text-sm font-semibold'>{post.likes.length} likes</h6>
                                </div>
                                <div className='flex gap-3 pb-[10px]'>
                                    <span className='font-bold text-xs'>{post.postedBy.userName}</span>
                                    <span className='text-xs font-medium text-gray-700'>{post.title}</span>
                                </div>
                                {post.comments.slice(0, 3).map((comment, index) => (
                                    <div key={index} className="flex items-center gap-2 gap-y-3 mb-3">
                                        <img src={comment.profilePic} className="w-[25px] h-[25px] rounded-full" alt="" />
                                        <div className="flex gap-1 items-center text-center">
                                            <span className="font-bold text-[16px]">{comment.username}</span>
                                            <p className="text-gray-600 text-[10px]">{comment.comment}</p>
                                        </div>
                                    </div>
                                ))}
                                <div>
                                    <button onClick={() => toggleModal(post.comments)} className='text-gray-500 text-s' type='button'>View all comments</button>
                                </div>
                                <div className='max-h-[85px]'>
                                    <div className='flex justify-between'>
                                        <div>
                                            <input type="text" placeholder='Add a comment...' ref={el => commentRef.current[post._id] = el} />
                                        </div>
                                        <div>
                                            <button className='text-gray-500' onClick={() => sendComment(post._id)}>Post</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal showModal={showModal} comments={modalComments} onClose={() => setShowModal(false)} />
        </div>
    );
};

const Modal = ({ showModal, comments, onClose }) => {
    if (!showModal) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-[500px] h-[400px] p-4 rounded-lg overflow-y-scroll scrollbar-hidden">
                <button onClick={onClose} className="absolute text-white text-[25px] right-4 top-4">X</button>
                <div className=" h-full mt-4">
                    {comments.map((comment) => (
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
        </div>
    );
};

export default Posts;
