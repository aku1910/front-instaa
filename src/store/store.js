import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../slices/user.slice';
import postReducer from '../slices/post.slice';
import conversationsReducer from '../slices/conversation.slice';
import messagesReducer from '../slices/messages.slice';
import adminReducer from "../slices/admin.slice";
import { thunk } from "redux-thunk";

const store = configureStore({
  reducer: {
  
    user: userReducer,
    posts: postReducer,
    conversations: conversationsReducer,
    messages: messagesReducer,
    admin:adminReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),

});


export default store;