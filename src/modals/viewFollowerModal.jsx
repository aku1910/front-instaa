import React from 'react';
import { Link } from 'react-router-dom';

const ViewFollowers = ({ openModal, setOpenModal, currentFollowers }) => {

    if (!openModal) return null;

    return (
        <div className="fixed inset-0 flex  items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded w-[300px] h-[300px] overflow-y-scroll">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Followers</h2>
                    <button onClick={() => setOpenModal(false)} className="text-[20px]">x</button>
                </div>
                <ul>
                    {currentFollowers && currentFollowers.length > 0 ? (
                        currentFollowers.map((follower, index) => (
                                <Link to={`/peopleProfile/${follower._id}`}>
                            <div key={index} className="flex items-center mb-2">
                                    <img src={`../${follower.profilePic}`} alt="" className="w-8 h-8 rounded-full mr-2" />
                                    <li className='text-[14px]'>{follower.userName}</li>
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

export default ViewFollowers;
