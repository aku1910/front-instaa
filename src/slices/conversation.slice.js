import { createSlice } from "@reduxjs/toolkit"


const conversationSlice = createSlice({
    name: "conversation",
    initialState: {
        conversations: [],
        selectedConversation: null,
    },
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload
        },
        setSelectedConversations: (state, action) => {
            state.selectedConversation = action.payload;
        }
    }
})

export const { setConversations, setSelectedConversations } = conversationSlice.actions

export default conversationSlice.reducer