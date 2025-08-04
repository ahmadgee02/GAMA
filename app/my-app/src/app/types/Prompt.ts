export interface Prompt {
    _id: string;
    name: string;
    shortDescription: string;
    description: string;
    isEnabled: boolean;
    type: string;
}

export interface AddPrompt {
    name: string;
    shortDescription: string;
    description: string;
    isEnabled: boolean;
    type: string;
}