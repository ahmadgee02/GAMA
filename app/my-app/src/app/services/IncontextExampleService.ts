import type { IncontextExample, AddIncontextExample } from "@/app/types"
import http from "./core/httpService";

export const getAllIncontextExamplesService = async (): Promise<IncontextExample[]> => {
    try {
        const response = await http.get('/incontext-examples');
        return response.data;
    } catch (error) {
        return []
    }
}

export const addIncontextExampleService = async (exampleData: AddIncontextExample): Promise<IncontextExample> => {
    try {
        const response = await http.post('/incontext-examples', exampleData);
        return response.data;
    } catch (error: any) {
        return null!
    }
}

export const editIncontextExampleService = async (exampleData: AddIncontextExample, IncontextExampleId: string): Promise<IncontextExample> => {
    try {
        const response = await http.put(`/incontext-examples/${IncontextExampleId}`, exampleData);
        return response.data;
    } catch (error: any) {
        
        return null!
    }
}

export const deleteIncontextExampleService = async (exampleId: string): Promise<boolean> => {
    try {
        await http.delete(`/incontext-examples/${exampleId}`);
        return true;
    } catch (error) {
        return false;
    }
}