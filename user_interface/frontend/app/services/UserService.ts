import type { User, RegisterUser } from "@/types"
import http from "./core/HttpService";
// import { delay } from "@/utils"

export const getAllUsersService = async (): Promise<User[]> => {
    try {
        const response = await http.get('/users');

        return response.data;
    } catch (error) {
        return null!
    }
}

export const registerUserService = async (userData: RegisterUser): Promise<User> => {
    try {
        const response = await http.post('/users', userData);

        return response.data;
    } catch (error: any) {
        
        return null!
    }
}

export const editUserService = async (userData: RegisterUser, userId: string): Promise<User> => {
    try {
        const response = await http.put(`/users/${userId}`, userData);

        return response.data;
    } catch (error: any) {
        
        return null!
    }
}

export const deleteUserService = async (userId: string): Promise<boolean> => {
    try {
        await http.delete(`/users/${userId}`);
        return true;
    } catch (error) {
        return false;
    }
}