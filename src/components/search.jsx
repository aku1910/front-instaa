import SearchIcon from "../image/search.png";
import { AiFillCloseCircle } from "react-icons/ai";
import classNames from "classnames";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const fetchData = async (query) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/users?query=${encodeURIComponent(query)}`, {
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
                console.log("API Response:", result); // Log the entire response

                // Adjust based on the actual response structure
                if (Array.isArray(result)) {
                    setUsers(result.filter(user => user.userName.toLowerCase().includes(query.toLowerCase()))); // Filter results
                } else if (result && result.users && Array.isArray(result.users)) {
                    setUsers(result.users.filter(user => user.userName.toLowerCase().includes(query.toLowerCase()))); // Filter results
                } else {
                    setError('Unexpected response format');
                }
            }
        } catch (error) {
            setError(`Fetch error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (searchQuery.trim()) {
            fetchData(searchQuery.trim());
        } else {
            setUsers([]); // Clear users when query is empty
        }
    }, [searchQuery]);

    const [open, setOpen] = useState(false);

    return (
        <div className="w-[268px] relative z-1"> {/* z-index added */}
            <span className={classNames({
                "absolute text-[#8e8e8e] pointer-events-none top-0 left-0 h-9 w-9 flex items-center justify-center z-10": true, // Ensure it's below the input
                "hidden": open
            })}>
                <img className="w-[16px]" src={SearchIcon} alt="Search" />
            </span>
            <input
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                className="h-9 pl-9 w-full focus:pl-3 outline-none rounded bg-[#efefef] z-30" // Ensure it's above other elements
                type="text"
                placeholder="Search"
            />
            {open && (
                <button
                    onClick={() => setOpen(false)}
                    className="absolute text-[#c7c7c7] top-0 right-0 w-9 h-9 flex items-center justify-center z-30" // Ensure it's above other elements
                >
                    <AiFillCloseCircle />
                </button>
            )}
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {users.length > 0 && (
                <ul className="absolute top-[calc(100%+0.25rem)] w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto z-20"> {/* Adjust z-index here as well */}
                    {users.map(user => (
                        <Link to={`/peopleProfile/${user._id}`} key={user.id}>
                            <li className="p-2 border-b border-gray-200 flex items-center cursor-pointer z-20">
                                {user.profilePic && <img src={user.profilePic} alt={user.userName} className="w-8 h-8 object-cover rounded-full mr-2" />}
                                {user.userName}
                            </li>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    );
}
