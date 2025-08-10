import { Message } from "./Chat";

export interface Agent {
    name: string,
    strategyName: string,
    strategyRules: string,
    status: string,
    gameRules: string,
    gameMoves: string[],
    gamePlayers: string[],
    defaultMove: string,
    moves: string[],
    payoffs: string[],
    totalPayoff: number,
    traceMessages: string[],
    attempts: number
}

export interface AgentHistory {
    _id: string;
    agentData: Agent
    history: Message[]
}