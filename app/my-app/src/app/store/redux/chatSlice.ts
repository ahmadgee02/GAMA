import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from '../index'
import type { Prompt, Message, IncontextExample, Agent } from "@/app/types"
import { getAgentService } from '@/app/services/AgentService';

// Define a type for the slice state
interface ChatState {
    loading: boolean;
    description: string,
    messages: Message[],
    incontextExample: IncontextExample,
    prompt: Prompt,
    agent: Agent
}

// Define the initial state using that type
const initialState: ChatState = {
    loading: false,
    prompt: null!,
    incontextExample: null!,
    description: '',
    messages: [],
    agent: null!
}

export const chatSlice = createSlice({
    name: 'chat',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setPrompt: (state, action: PayloadAction<Prompt>) => {
            state.prompt = action.payload
        },
        setIncontextExample: (state, action: PayloadAction<IncontextExample>) => {
            state.incontextExample = action.payload
        },
        setDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload
        },
        setMessageHistory: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
        setMessageHistory2: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        setAgent: (state, action: PayloadAction<Agent>) => {
            state.agent = action.payload
        }
    },
})

export const { setLoading, setPrompt, setDescription, setMessageHistory, setIncontextExample, setAgent, setMessageHistory2 } = chatSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectLoading = (state: RootState) => state.chat.loading
export const selectPrompt = (state: RootState) => state.chat.prompt;
export const selectIncontextExample = (state: RootState) => state.chat.incontextExample;
export const selectDescription = (state: RootState) => state.chat.description;
export const selectMessagesHistory = (state: RootState) => state.chat.messages;
export const selectAgent  = (state: RootState) => state.chat.agent;

export default chatSlice.reducer;

export const getAgentsHistory = (agentId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    const agent = await getAgentService(agentId);

    dispatch(setLoading(false))
    dispatch(setAgent(agent.agentData));
    
    dispatch(setMessageHistory2(agent.history) )
}
