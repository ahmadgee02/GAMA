import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import type { Prompt, Message } from "@/app/types"

// Define a type for the slice state
interface ChatState {
    loading: boolean;
    prompt: Prompt,
    description: string,
    messages: Message[]
}

// Define the initial state using that type
const initialState: ChatState = {
    loading: false,
    prompt: null!,
    description: '',
    messages: [],
}

export const chatSlice = createSlice({
    name: 'chat',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loading = true;
        },
        setPrompt: (state, action: PayloadAction<Prompt>) => {
            state.prompt = action.payload
        },
        setDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload
        },
        setMessageHistory: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
        // setMessageHistory: (state, action: PayloadAction<>) => {
        //     state.messages = state.messages.concat(action.payload)
        // }
    },
})

export const { setLoading, setPrompt, setDescription, setMessageHistory } = chatSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectLoading = (state: RootState) => state.chat.loading
export const selectPrompt = (state: RootState) => state.chat.prompt;
export const selectDescription = (state: RootState) => state.chat.description;
export const selectMessagesHistory = (state: RootState) => state.chat.messages;

export default chatSlice.reducer;