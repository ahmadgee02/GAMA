import type { AgentHistory  } from "@/app/types"
import http from "./core/httpService";

export const getAgentService = async (agentId: string): Promise<AgentHistory> => {
    try {
        const response = await http.get(`/agents/${agentId}`);
        return response.data;
    } catch (error) {
        return null!
    }
}

export const getAllAgentsService = async (): Promise<AgentHistory[]> => {
    try {
        const response = await http.get('/agents');
        return response.data;
    } catch (error) {
        return []
    }
}

export const deleteagentService = async (agentId: string): Promise<boolean> => {
    try {
        await http.delete(`/agents/${agentId}`);
        return true;
    } catch (error) {
        return false;
    }
}