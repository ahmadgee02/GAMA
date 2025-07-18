import { createSlice, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '../index'
import type { User, Prompt, RegisterUser, AddPrompt } from "@/app/types"
import { registerUserService, getAllUsersService, deleteUserService, editUserService } from "@/app/services/userService";
import { addPromptService, getAllPromptsService, deletePromptService, editPromptService } from "@/app/services/promptService";

// Define a type for the slice state
interface AuthState {
    loading: boolean;
    users: User[],
    prompts: Prompt[]
}

// Define the initial state using that type
const initialState: AuthState = {
    loading: false,
    users: [],
    prompts: []
}

export const pageSlice = createSlice({
    name: 'page',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loading = true;
        },
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
            state.loading = false;
        },
        setPrompts: (state, action: PayloadAction<Prompt[]>) => {
            state.prompts = action.payload;
            state.loading = false;
        },
        setRegisterUser: (state, action: PayloadAction<User>) => {
            state.users = [...state.users, action.payload];
            state.loading = false;
        },
        setEditUser: (state, action: PayloadAction<User>) => {
            state.users = state.users.map((user) => user._id === action.payload._id ? action.payload : user);
            state.loading = false;
        },
        setdeleteUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(user => user._id !== action.payload);
            state.loading = false;
        },
        setNewPrompt: (state, action: PayloadAction<Prompt>) => {
            state.prompts = [...state.prompts, action.payload];
            state.loading = false;
        },
        setEditPrompt: (state, action: PayloadAction<Prompt>) => {
            state.prompts = state.prompts.map((prompt) => prompt._id === action.payload._id ? action.payload : prompt);
            state.loading = false;
        },
        setdeletePrompt: (state, action: PayloadAction<string>) => {
            state.prompts = state.prompts.filter(prompt => prompt._id !== action.payload);
            state.loading = false;
        },
    },
})

export const {
    setLoading,
    setUsers, setRegisterUser, setEditUser, setdeleteUser,
    setPrompts, setNewPrompt, setEditPrompt, setdeletePrompt,
} = pageSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUsers = (state: RootState) => state.page.users
export const selectPrompts = (state: RootState) => state.page.prompts
export const selectLoading = (state: RootState) => state.page.loading

export const selectEnabledPrompts = createSelector([selectPrompts], (prompts) => {
    return prompts.filter(prompt => prompt.isEnabled)
})

export const selectPromptById = (state: RootState, promptId: string) =>
  state.page.prompts.find(prompt => prompt._id === promptId);

export default pageSlice.reducer


export const registerUser = (data: RegisterUser) => async (dispatch: AppDispatch) => {
    dispatch(setLoading())
    const user = await registerUserService(data);

    user && dispatch(setRegisterUser(user));

    return !!user
}

export const editUser = (data: RegisterUser, userId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading())
    const user = await editUserService(data, userId);

    user && dispatch(setEditUser(user));

    return !!user
}

export const getAllUsers = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading())
    const users = await getAllUsersService();

    dispatch(setUsers(users));
}

export const deleteUser = (userId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading())
    await deleteUserService(userId);

    dispatch(setdeleteUser(userId));
}


export const addPrompt = (data: AddPrompt) => async (dispatch: AppDispatch) => {
    dispatch(setLoading())
    const prompt = await addPromptService(data);

    prompt && dispatch(setNewPrompt(prompt));

    return !!prompt
}

export const editPrompt = (data: AddPrompt, promptId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading())
    const prompt = await editPromptService(data, promptId);

    prompt && dispatch(setEditPrompt(prompt));

    return !!prompt
}

export const getAllPrompts = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading())
    const prompts = await getAllPromptsService();

    dispatch(setPrompts(prompts));
}

export const deletePrompt = (userId: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading())
    await deletePromptService(userId);

    dispatch(setdeletePrompt(userId));
}

