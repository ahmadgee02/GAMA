import type { Prompt, AddPrompt } from "@/app/types"
import http from "./core/httpService";

export const getAllPromptsService = async (): Promise<Prompt[]> => {
    try {
        const response = await http.get('/prompts');
        return response.data;
    } catch (error) {
        return []
    }
}

export const addPromptService = async (promptData: AddPrompt): Promise<Prompt> => {
    try {
        const response = await http.post('/prompts', promptData);
        return response.data;
    } catch (error: any) {
        return null!
    }
}

export const editPromptService = async (promptData: AddPrompt, promptId: string): Promise<Prompt> => {
    try {
        const response = await http.put(`/prompts/${promptId}`, promptData);
        return response.data;
    } catch (error: any) {
        return null!
    }
}

export const deletePromptService = async (promptId: string): Promise<boolean> => {
    try {
        await http.delete(`/prompts/${promptId}`);
        return true;
    } catch (error) {
        return false;
    }
}