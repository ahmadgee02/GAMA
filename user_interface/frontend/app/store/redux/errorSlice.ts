import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '../index'
import type { User, loginData } from "@/types"
import { loginService } from '@/services/AuthService'
import { local_storage_web_key } from "@/utils/Constants"
import { decodeToken } from "react-jwt";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

// Define a type for the slice state
interface AuthState {
    loading: boolean;
    user: User
}

// Define the initial state using that type
const initialState: AuthState = {
    loading: false,
    user: null!,
}

export const authSlice = createSlice({
    name: 'auth',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
            state.loading = false
        },
        setLoading: (state) => {
            state.loading = true;
        }
    },
})

export const { setUser, setLoading } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.auth.user
export const selectLoading = (state: RootState) => state.auth.loading

export default authSlice.reducer

export const login = (data: loginData, router: AppRouterInstance) => async (dispatch: AppDispatch) => {
    dispatch(setLoading())
    const token = await loginService(data);

    console.log("token", token.access_token);
    localStorage.setItem(local_storage_web_key, token.access_token);
    const user = decodeToken(token.access_token) as User;
    console.log("user", user);

    dispatch(setUser(user));

    router.push("/");
}

export const logout = (router: AppRouterInstance) => async (dispatch: AppDispatch) => {
    localStorage.removeItem(local_storage_web_key);
    dispatch(setUser(null!));

    router.push("/login")
}