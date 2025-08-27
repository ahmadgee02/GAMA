import { createSlice, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '../index'
import type { User, IncontextExample, RegisterUser, AddIncontextExample, Prompt, AddPrompt, AgentHistory } from "@/types";
import { IncontextType } from "@/types";
import { registerUserService, getAllUsersService, deleteUserService, editUserService } from "@/services/UserService";
import { addIncontextExampleService, getAllIncontextExamplesService, deleteIncontextExampleService, editIncontextExampleService } from "@/services/IncontextExampleService";
import { addPromptService, getAllPromptsService, deletePromptService, editPromptService } from "@/services/PromptService";
import { getAllAgentsService, deleteAgentService, downloadAgentsJson } from '@/services/AgentService';

// Define a type for the slice state
interface AuthState {
    loading: boolean;
    users: User[],
    incontextExamples: IncontextExample[],
    prompts: Prompt[],
    agentHistory: AgentHistory[]
}

// Define the initial state using that type
const initialState: AuthState = {
    loading: false,
    users: [],
    incontextExamples: [],
    prompts: [],
    agentHistory: []
}

export const pageSlice = createSlice({
    name: 'page',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
        },
        setRegisterUser: (state, action: PayloadAction<User>) => {
            state.users = [...state.users, action.payload];
        },
        setEditUser: (state, action: PayloadAction<User>) => {
            state.users = state.users.map((user) => user._id === action.payload._id ? action.payload : user);
        },
        setdeleteUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(user => user._id !== action.payload);
        },
        setIncontextExamples: (state, action: PayloadAction<IncontextExample[]>) => {
            state.incontextExamples = action.payload;
        },
        setNewIncontextExample: (state, action: PayloadAction<IncontextExample>) => {
            state.incontextExamples = [...state.incontextExamples, action.payload];
        },
        setEditIncontextExample: (state, action: PayloadAction<IncontextExample>) => {
            state.incontextExamples = state.incontextExamples.map((example) => example._id === action.payload._id ? action.payload : example);
        },
        setdeleteIncontextExample: (state, action: PayloadAction<string>) => {
            state.incontextExamples = state.incontextExamples.filter(example => example._id !== action.payload);
        },
        setPrompts: (state, action: PayloadAction<Prompt[]>) => {
            state.prompts = action.payload;
        },
        setNewPrompt: (state, action: PayloadAction<Prompt>) => {
            state.prompts = [...state.prompts, action.payload];
        },
        setEditPrompt: (state, action: PayloadAction<Prompt>) => {
            state.prompts = state.prompts.map((prompt) => prompt._id === action.payload._id ? action.payload : prompt);
        },
        setdeletePrompt: (state, action: PayloadAction<string>) => {
            state.prompts = state.prompts.filter(prompt => prompt._id !== action.payload);
        },
        setAgentHistory: (state, action: PayloadAction<AgentHistory[]>) => {
            state.agentHistory = action.payload
        },
        addNewAgent: (state, action: PayloadAction<AgentHistory>) => {
            state.agentHistory = [action.payload, ...state.agentHistory]
        },
        setdeleteAgent: (state, action: PayloadAction<string>) => {
            state.agentHistory = state.agentHistory.filter(agent => agent._id !== action.payload);
        },
    },
})

export const {
    setLoading,
    setUsers, setRegisterUser, setEditUser, setdeleteUser,
    setIncontextExamples, setNewIncontextExample, setEditIncontextExample, setdeleteIncontextExample,
    setPrompts, setNewPrompt, setEditPrompt, setdeletePrompt, setAgentHistory, addNewAgent, setdeleteAgent
} = pageSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUsers = (state: RootState) => state.page.users;
export const selectIncontextExamples = (state: RootState) => state.page.incontextExamples;
export const selectPrompts = (state: RootState) => state.page.prompts;
export const selectLoading = (state: RootState) => state.page.loading;
export const selectAgentHistory = (state: RootState) => state.page.agentHistory;

export const selectPrioritizedAgentHistory = createSelector(
    [selectAgentHistory],
    (agentHistory) => {
        return [...agentHistory].sort((a, b) => {
            if (a.agentData.status === "correct" && b.agentData.status !== "correct") return 1;
            if (a.agentData.status !== "correct" && b.agentData.status === "correct") return -1;
            return 0;
        });
    }
);

export const selectEnabledIncontextExamples = createSelector([selectIncontextExamples], (IncontextExamples) => {
    return IncontextExamples.filter(incontextExamples => incontextExamples.isEnabled)
})

export const selectPromptsBySlug = (slug: string) => createSelector([selectPrompts], (prompts) => {
    return prompts.filter(prompt => prompt.type === slug)
})

export const selectPromptById = (promptId: string) => createSelector([selectPrompts], (prompts) => {
    return prompts.find(prompt => prompt._id === promptId)
})


export const selectIncontextExamplesById = (state: RootState, incontextExamplesId: string) =>
    state.page.incontextExamples.find(incontextExamples => incontextExamples._id === incontextExamplesId);

export const selectStrategies = createSelector([selectPrompts], (prompts) => {
    return prompts.filter(prompt => prompt.type === "stratergy" && prompt.isEnabled);
})

export const selectGames = createSelector([selectPrompts], (prompts) => {
    return prompts.filter(prompt => prompt.type === "game" && prompt.isEnabled);
})

export const selectIncontextGameExamples = createSelector([selectIncontextExamples], (incontextExamples) => {
    return incontextExamples.filter(example => example.type === IncontextType.Game && example.isEnabled);
})

export const selectIncontextStratergyExamples = createSelector([selectIncontextExamples], (incontextExamples) => {
    return incontextExamples.filter(example => example.type === IncontextType.Stratergy && example.isEnabled);
})

export const selectIncontextGameStratergyExamples = createSelector([selectIncontextExamples], (incontextExamples) => {
    return incontextExamples.filter(example => example.type === IncontextType.GameStratergy && example.isEnabled);
})


export default pageSlice.reducer


export const registerUser = (data: RegisterUser) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    const user = await registerUserService(data);

    user && dispatch(setRegisterUser(user));

    dispatch(setLoading(false))
    return !!user
}

export const editUser = (data: RegisterUser, userId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    const user = await editUserService(data, userId);

    user && dispatch(setEditUser(user));

    dispatch(setLoading(false))
    return !!user
}

export const getAllUsers = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    const users = await getAllUsersService();

    dispatch(setLoading(false))
    dispatch(setUsers(users));
}

export const deleteUser = (userId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    await deleteUserService(userId);

    dispatch(setLoading(false))
    dispatch(setdeleteUser(userId));
}


export const addIncontextExample = (data: AddIncontextExample) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    const incontextExamples = await addIncontextExampleService(data);

    incontextExamples && dispatch(setNewIncontextExample(incontextExamples));

    dispatch(setLoading(false))

    return !!incontextExamples
}

export const editIncontextExample = (data: AddIncontextExample, incontextExamplesId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    const incontextExamples = await editIncontextExampleService(data, incontextExamplesId);

    incontextExamples && dispatch(setEditIncontextExample(incontextExamples));

    dispatch(setLoading(false))
    return !!incontextExamples
}

export const getAllIncontextExamples = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    const incontextExamples = await getAllIncontextExamplesService();

    dispatch(setLoading(false))
    dispatch(setIncontextExamples(incontextExamples));
}

export const deleteIncontextExample = (userId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    await deleteIncontextExampleService(userId);

    dispatch(setLoading(false))
    dispatch(setdeleteIncontextExample(userId));
}


export const addPrompt = (data: AddPrompt) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    const prompt = await addPromptService(data);

    prompt && dispatch(setNewPrompt(prompt));

    dispatch(setLoading(false))

    return !!prompt
}

export const editPrompt = (data: AddPrompt, promptId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    const prompt = await editPromptService(data, promptId);

    prompt && dispatch(setEditPrompt(prompt));

    dispatch(setLoading(false))
    return !!prompt
}

export const getAllPrompts = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    const prompts = await getAllPromptsService();

    dispatch(setLoading(false))
    dispatch(setPrompts(prompts));
}

export const deletePrompt = (promptId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    await deletePromptService(promptId);

    dispatch(setLoading(false))
    dispatch(setdeletePrompt(promptId));
}

export const getAllAgentsHistory = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    const agents = await getAllAgentsService();

    dispatch(setLoading(false))
    dispatch(setAgentHistory(agents));
}

export const deleteAgent = (agentId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    await deleteAgentService(agentId);

    dispatch(setLoading(false))
    dispatch(setdeleteAgent(agentId));
}


export const exportAgents = () => async (disptch: AppDispatch) => {

    const data = await downloadAgentsJson();

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'agents.json');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}