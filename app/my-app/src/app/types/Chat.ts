export enum Role {
    Agent = "agent",
    User = "user"
}

export enum Mode {
    Game = "Game",
    Stratergy = "Stratergy",
    Game_Stratergy = "Game & Stratergy"
}

export enum ExtraDataType {
    Text = "Text",
    Code = "Code"
}

export interface ExtraData {
    heading: string;
    text: string | string[];
    type: ExtraDataType;
}

export interface Message {
    text: string | string[];
    data?: ExtraData[]; // Assuming data can be any object, adjust as necessary
    heading: string;
    role: Role;
    type?: ExtraDataType;
}