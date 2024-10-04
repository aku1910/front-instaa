import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TbArrowBigLeftFilled } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { setConversations, setSelectedConversations } from '../slices/conversation.slice';
import { setMessages, addMessage } from '../slices/messages.slice';
import logo from "../image/InstaLogo.png";
import logos from '../image/logo.png';
import { setOnlineUsers, updateUserStatus } from '../slices/user.slice';
import useSocket from '../hooks/useSocket';

const Message = () => {
  const dispatch = useDispatch();
  const conversations = useSelector(state => state.conversations.conversations) || [];
  const selectedConversation = useSelector((state) => state.conversations.selectedConversation);
  const messages = useSelector(state => state.messages.messages) || [];
  const messageRef = useRef();
  const socket = useSocket();
  const onlineUsers = useSelector(state => state.user.onlineUsers);
  const messagesEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState(""); // Arama sorgusu durumu

  useEffect(() => {
    socket.on('getOnlineUsers', (userIds) => {
      dispatch(setOnlineUsers(userIds));
    });

    socket.on('userStatusChange', ({ userId, status }) => {
      dispatch(updateUserStatus({ userId, status }));
    });

    socket.on('newMessage', (newMessage) => {
      dispatch(addMessage(newMessage));
      scrollToBottom();
    });

    return () => {
      socket.off('getOnlineUsers');
      socket.off('userStatusChange');
      socket.off('newMessage');
      socket.disconnect();
    };
  }, [socket, dispatch]);

  const isOnline = onlineUsers.includes(selectedConversation?._id);

  useEffect(() => {
    getAllConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      getAllMessages();
    }
  }, [selectedConversation]);

  const getAllConversations = async () => {
    try {
      const response = await fetch('/api/users/');
      const data = await response.json();

      if (!response.ok) {
        console.log("Failed to get all conversations");
      } else {
        dispatch(setConversations(data));
      }
    } catch (error) {
      console.log(`Fetch error: ${error}`);
    }
  };

  const selectConversation = (conversation) => {
    dispatch(setSelectedConversations(conversation));
  };

  const getAllMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${selectedConversation._id}`);
      const data = await response.json();

      if (!response.ok) {
        console.log("Failed to get all messages");
      } else {
        dispatch(setMessages(data));
        scrollToBottom();
      }
    } catch (error) {
      console.log(`Fetch error: ${error}`);
    }
  };

  const sendMessage = async () => {
    const message = messageRef.current.value.trim();

    if (message === "") return;

    try {
      const response = await fetch(`/api/messages/${selectedConversation._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Failed to send message");
      } else {
        dispatch(addMessage(data));
        messageRef.current.value = ''; // Clear input after sending message
        scrollToBottom();
      }
    } catch (error) {
      console.log(`Fetch error: ${error}`);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-auto md:w-[300px] h-full bg-gray-100 border-r border-gray-200 flex flex-col">
        {/* Search Input */}
        <div className="p-4 hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Back Button */}
        <div className='p-4 flex justify-center sm:justify-start ml-6 text-[20px]'>
          <Link to="/"><TbArrowBigLeftFilled /></Link>
        </div>

        {/* Conversation List */}
        <div className="p-4 flex-1 flex flex-col overflow-y-scroll">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => selectConversation(conversation)}
              className={`flex h-[60px] border-b items-center gap-2 cursor-pointer ${selectedConversation && selectedConversation._id === conversation._id ? 'bg-gray-200' : ''}`}
            >
              <img src={conversation.profilePic} alt="User" className="rounded-full w-[35px] h-[35px] object-cover" />
              <h1 className="font-semibold hidden sm:block">{conversation.userName}</h1>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          {selectedConversation ? (
            <Link to={`/peopleProfile/${selectedConversation._id}`}>
              <div className="flex items-center">
                <img src={selectedConversation.profilePic} className="rounded-full w-10 h-10 object-cover" alt="Selected User" />
                <div className="ml-4">
                  <div className="font-semibold">{selectedConversation.userName}</div>
                  <p>{isOnline ? 'online' : 'offline'}</p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex items-center">
              <div className="font-semibold text-gray-500 flex items-center">
                <img className='h-[80px] pb-4' src={logo} alt="Logo" />
                <img src={logos} className='h-[30px]' alt="Logo" />
              </div>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className='overflow-y-scroll scrollbar-hidden'>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedConversation ? (
              <div className="h-full flex flex-col justify-end mb-12">
                <div className='flex justify-center pb-[100px]'>
                  <Link to={`/peopleProfile/${selectedConversation._id}`}>
                    <div className='flex items-center flex-col gap-y-2 text-[20px]'>
                      <img className='w-[160px] h-[160px] rounded-full object-cover' src={selectedConversation.profilePic} alt="Selected User" />
                      <h1>{selectedConversation.fullName}</h1>
                    </div>
                  </Link>
                </div>
                {messages.map((message, index) => (
                  <div key={index}>
                    <div className={`mb-4 ${message.senderId === selectedConversation._id ? 'text-left' : 'text-right'}`}>
                      <div className={`max-w-xs sm:max-w-sm md:max-w-[200px] lg:max-w-[250px] xl:max-w-[400px] break-words w-auto h-auto flex-wrap p-4 rounded-lg inline-block ${message.senderId === selectedConversation._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                        {message.message}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">{new Date(message.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="p-4 overflow-y-auto">
                <p className="text-center text-gray-500">Select a conversation to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Input */}
        {selectedConversation && (
          <div className="p-4 border-t border-gray-200 flex fixed bottom-0 sm:auto md:w-[80%] bg-white z-10">
            <input
              type="text"
              placeholder="Enter your message..."
              className="w-full p-2 border border-gray-300 rounded"
              ref={messageRef}
            />
            <button className="bg-blue-500 text-white p-2 rounded ml-2" onClick={sendMessage}>
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
