export enum IncontextType {
    Game = "Game",
    Stratergy = "Stratergy",
    GameStratergy = "Game & Stratergy"
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