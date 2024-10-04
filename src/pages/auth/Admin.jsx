import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { IoPersonOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Admin = () => {
  const [admin, setAdmin] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(`Server error: ${errorMessage}`);
      } else {
        const result = await response.json();
        if (result.users && Array.isArray(result.users)) {
          setAdmin(result.users);
        } else {
          setError('Unexpected admin format');
        }
      }
    } catch (error) {
      setError(`Fetch error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(`Server error: ${errorMessage}`);
      } else {
        setAdmin(admin.filter(user => user._id !== userId));
      }
    } catch (error) {
      setError(`Delete error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='instabg h-[100vh]'>
      <Link to="/auth/signin">
        <p className='text-white absolute right-3 top-3 text-[20px]'><IoPersonOutline /></p>
      </Link>
      <div className="p-4  sm:p-6 md:p-8 max-w-full mx-auto">

        <div className='grid  justify-center'>
          <button
            onClick={fetchData}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Fetch Users
          </button>
        </div>
        <h2 className="text-xl sm:text-2xl mb-4 text-white font-bold">Users:</h2>
        {error && <p className="text-red-500">{error}</p>}
        {loading && <p className='text-white font-semibold'>Loading...</p>}
        {admin.length > 0 && (
          <div className="overflow-x-auto">
            <div className="block md:hidden">
              {/* Flex container for small screens */}
              {admin.map(user => (
                <div key={user._id} className="flex flex-col bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-300">
                  <div className='flex-shrink-0 mb-2'>
                    <img className='w-8 h-8 sm:w-10 sm:h-10 rounded-full' src={user.profilePic} alt="" />
                  </div>
                  <div className="flex-1 mb-2">
                    <p className="text-sm sm:text-base">{user.email}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="px-2 sm:px-3 py-1 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                    >
                      <FaTrash className="mr-1 sm:mr-2" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block">
              {/* Table for larger screens */}
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr>
                    <th className="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs sm:text-sm leading-4 text-gray-600 uppercase">Profile Picture</th>
                    <th className="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs sm:text-sm leading-4 text-gray-600 uppercase">Email</th>
                    <th className="px-4 sm:px-6 py-3 border-b-2 border-gray-300 text-left text-xs sm:text-sm leading-4 text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admin.map(user => (
                    <tr key={user._id}>
                      <td className='px-4 sm:px-6 py-4 border-b border-gray-300'>
                        <img className='w-8 h-8 sm:w-10 sm:h-10 rounded-full' src={user.profilePic} alt="" />
                      </td>
                      <td className="px-4 sm:px-6 py-4 border-b border-gray-300">{user.email}</td>
                      <td className="px-4 sm:px-6 py-4 border-b border-gray-300">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="px-2 sm:px-3 py-1 sm:py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                        >
                          <FaTrash className="mr-1 sm:mr-2" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default Admin;
