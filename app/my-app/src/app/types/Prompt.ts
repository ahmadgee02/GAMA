export interface Prompt {
    _id: string;
    name: string;
    description: string;
    isEnabled: boolean;
}

export interface AddPrompt {
    name: string;
    description: string;
    isEnabled: boolean;
}