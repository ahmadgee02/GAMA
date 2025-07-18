import type { Prompt, AddPrompt } from "@/app/types"
import http from "./core/httpService";
// import { delay } from "@/app/utils"

export const getAllPromptsService = async (): Promise<Prompt[]> => {
    try {
        const response = await http.get('/prompts');

        return response.data;
    } catch (error) {
        return []
    }
}

export const addPromptService = async (userData: AddPrompt): Promise<Prompt> => {
    try {
        const response = await http.post('/prompts', userData);

        return response.data;
    } catch (error: any) {
        
        return null!
    }
}

export const editPromptService = async (userData: AddPrompt, promptId: string): Promise<Prompt> => {
    try {
        const response = await http.put(`/prompts/${promptId}`, userData);

        return response.data;
    } catch (error: any) {
        
        return null!
    }
}

export const deletePromptService = async (userId: string): Promise<boolean> => {
    try {
        await http.delete(`/prompts/${userId}`);
        return true;
    } catch (error) {
        return false;
    }
}