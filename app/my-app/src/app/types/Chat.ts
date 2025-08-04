export enum Role {
    Agent = "agent",
    User = "user"
}

export interface Message {
    text: string | string[];
    data?: { [key: string]: any }; // Assuming data can be any object, adjust as necessary
    heading: string;
    role: Role;
}