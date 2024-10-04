import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Header from './header';
import Footer from './footer';
import Loader from './loader';
import ViewFollowers from '../modals/viewFollowerModal';
import ViewFollow from '../modals/viewFollowModal';
import { RiWindow2Line } from 'react-icons/ri';
import PostModal from '../modals/otherPeoplePostModal';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from 'slices/user.slice';
import { Link } from 'react-router-dom';
import { setSelectedConversations } from 'slices/conversation.slice';
import { setMessages } from 'slices/messages.slice';

const fetchUserProfile = async (userId) => {

    try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error: ${response.status} ${response.statusText} - ${errorText}`);
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

const fetchPosts = async (userId) => {
    try {
        const response = await fetch(`/api/post/getuserpost/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
};

const Profile = () => {
    const { id } = useParams();
    const [user, setUserr] = useState(null);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openFollowingModal, setOpenFollowingModal] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false); // New loading state
    const loggedInUser = useSelector(state => state.user.user);
    const [isFollowed, setisFollowed] = useState(); //
    const dispatch = useDispatch()

    const [conversation, setConversation] = useState(); 

    const selectedConversation = useSelector(state => state.conversations.selectedConversation);

 



    useEffect(() => {
        const getPosts = async () => {
            const fetchedPosts = await fetchPosts(id);
            setPosts(fetchedPosts);
        };

        getPosts();
    }, [id]);

    const postsCount = posts.length;

    const handleFollowClick = async () => {
        if (!user) return;
    
        setLoading(true); // Start loading
        try {
            const response = await fetch(`/api/auth/follow/${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                // body: JSON.stringify({
                //     following: [...user.following, {
                //         userId: user._id
                //     }]
                // })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error: ${response.status} ${response.statusText} - ${errorText}`);
                throw new Error('Network response was not ok');
            }

            const isFollowed = user.followers.find((x) => x._id === loggedInUser.user._id)

            if (isFollowed === undefined) {
                dispatch(setUser({ user: { ...loggedInUser?.user, following: [...loggedInUser?.user.following, user] } }))
                localStorage.setItem('user', JSON.stringify({ user: { ...loggedInUser.user, following: [...loggedInUser.user.following, user] } }))
                setisFollowed(true)
            } else {
                dispatch(setUser({ user: { ...loggedInUser?.user, following: loggedInUser.user.following.filter((x) => x._id !== user._id) } }))
                localStorage.setItem('user', JSON.stringify({ user: { ...loggedInUser.user, following: loggedInUser.user.following.filter((x) => x._id !== user._id) } }))
                setisFollowed(false)
            }
            setUserr(prevUser => ({
                ...prevUser,
                following: prevUser.following,
                followers: isFollowed === undefined ? [...prevUser.followers, loggedInUser.user] : prevUser.followers.filter(followerId => followerId._id !== loggedInUser.user._id)
            }));

        } catch (error) {
            console.error('Error following user:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

   

    const getUserProfile = async () => {
        // try {
        const userData = await fetchUserProfile(id);
        console.log(userData);
        setUserr(userData);
        console.log(userData);
        console.log();
        const isFollowed = loggedInUser?.user.following.find((x) => x._id === userData._id)
        setisFollowed(isFollowed === undefined ? false : true);
        // } catch (error) {
        //     setError(error.message);
        // }
    };
    useEffect(() => {
        getUserProfile();
    }, [id]);
    console.log(user);
    const getConversation = async () => {
       dispatch(setSelectedConversations(user))
      };

    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>{<Loader />}</div>;

    const handleFollowersClick = () => {
        setOpenModal(true);
    };

    const handleFollowingClick = () => {
        setOpenFollowingModal(true);
    };

    const handlePostClick = (post) => {
        setSelectedPost(post);
        setIsPostModalOpen(true);
    };

    const closePostModal = () => {
        setIsPostModalOpen(false);
        setSelectedPost(null);
    };

    const selectConversation = (conversation) => {
        dispatch(setSelectedConversations(conversation));
        console.log(conversation);
      };

    const isOwnProfile = loggedInUser?.user._id === user._id;


    console.log(isFollowed);
    return (
        <div>
            <Header />
            <div className="flex justify-center">
                <div className="grid mt-[20px]">
                    <div className=''>
                        <div className="flex justify-around flex-wrap gap-y-3 w-auto sm:w-[600px] ">
                            <div>
                                <img
                                    className="rounded-full w-[165px] object-cover h-[165px]"
                                    src={`../${user.profilePic}`}
                                    alt="Profile"
                                />
                            </div>
                            <div className="flex flex-col gap-y-5">
                                <div className="flex items-center gap-3">
                                    <p className="font-bold text-2xl">{user.userName}</p>
                                    {!isOwnProfile && (
                                        <button
                                            onClick={handleFollowClick}
                                            className={`border text-white  w-[90px] h-[35px] rounded-[10px] ${isFollowed ? 'bg-gray-500' : 'bg-[#0095F6]'}`}
                                            disabled={loading}
                                        >
                                            {loading ? 'Loading...' : isFollowed ? 'Unfollow' : 'Follow'}
                                        </button>
                                    )}
                                    
                                    {!isOwnProfile && (
                                        <Link to={`/Message`} onClick={getConversation}>
                                            <div>
                                                <h1 className='bg-gray-500 text-white w-[120px] h-[35px] flex justify-center items-center rounded-[10px]'>Send Message</h1>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <div className='flex gap-1'><p className='font-bold'>{postsCount}</p>gonderi</div>
                                    <div className="flex gap-1 cursor-pointer" onClick={handleFollowersClick}>
                                        <p className="font-bold">{user.followers?.length}</p> followers
                                    </div>
                                    <div className="flex gap-1 cursor-pointer" onClick={handleFollowingClick}>
                                        <p className="font-bold">{user.following?.length}</p> following
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold">{user.fullName}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center mt-[96px] border-t border-black pt-[15px]">
                            <div className="flex items-center gap-1">
                                <p><RiWindow2Line /></p>
                                <h1>POSTS</h1>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center flex-wrap ml-0 ">
                            <div className="flex gap-1 justify-center lg:justify-start flex-wrap max-w-screen-lg mb-10">
                                {posts.map((post) => (
                                    <div key={post._id} onClick={() => handlePostClick(post)}>
                                        <a href="#" key={post._id}>
                                            <img className="w-[307px] h-[307px] object-cover" src={`../${post.body}`} alt="Post" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ViewFollowers
                openModal={openModal}
                setOpenModal={setOpenModal}
                currentFollowers={user.followers || []}
            />
            <ViewFollow
                openFollowingModal={openFollowingModal}
                setOpenFollowingModal={setOpenFollowingModal}
                currentFollowing={user.following || []}
            />
            <PostModal
                isOpen={isPostModalOpen}
                post={selectedPost}
                onClose={closePostModal}
            />
            <Footer />
        </div>
    );
};

export default Profile;