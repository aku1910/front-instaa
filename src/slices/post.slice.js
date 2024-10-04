import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: "post",
    initialState: {
        likingPosts: JSON.parse(localStorage.getItem("likings")) || [],
        posts: [],
        comments: []
    },
    reducers: {
        addPostComment: (state, action) => {
            console.log(action.payload);
            state.comments = action.payload


        },
        
        setPosts: (state, action) => {
            const posts = action.payload
            state.posts = posts
        },
        likingPost: (state, action) => {
            // Yeni beğeni ekle
            state.likingPosts.push(action.payload);
            // localStorage'ı güncelle
            localStorage.setItem("likings", JSON.stringify(state.likingPosts));
        },
        unlikingPost: (state, action) => {
            // Beğeniyi kaldır
            state.likingPosts = state.likingPosts.filter(post => post._id !== action.payload._id);
            // localStorage'ı güncelle
            localStorage.setItem("likings", JSON.stringify(state.likingPosts));
        }
    }
});

export const { likingPost, unlikingPost, setPosts, addPostComment } = postSlice.actions;

export default postSlice.reducer;
