import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ViewFollow = ({ openFollowingModal, setOpenFollowingModal, currentFollowing }) => {

    if (!openFollowingModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded w-[300px] h-[300px] overflow-y-scroll">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Following</h2>
                    <button onClick={() => setOpenFollowingModal(false)} className="text-[20px]">x</button>
                </div>
                <ul>
                    {currentFollowing && currentFollowing.length > 0 ? (
                        currentFollowing.map((follow, index) => (
                            <Link to={`/peopleProfile/${follow._id}`}>

                            <div key={index} className="flex items-center mb-2">
                                <img src={`../${follow.profilePic}`} alt="" className="w-8 h-8 rounded-full mr-2" />
                                <li className='text-[14px]'>{follow.userName}</li>
                            </div>
                            </Link>
                        ))
                    ) : (
                        <li>No followers found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ViewFollow;
