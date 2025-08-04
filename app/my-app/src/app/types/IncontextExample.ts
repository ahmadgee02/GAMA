export enum IncontextType {
    Game = "game",
    Stratergy = "stratergy",
    GameStratergy = "game_stratergy"
}

export interface IncontextExample {
    _id: string;
    name: string;
    shortDescription: string;
    description: string;
    isEnabled: boolean;
    type: IncontextType;
}

export interface AddIncontextExample {
    name: string;
    shortDescription: string;
    description: string;
    isEnabled: boolean;
    type: IncontextType;
}