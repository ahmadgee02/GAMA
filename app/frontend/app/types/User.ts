export interface User {
    _id: string
    name: string;
    email: string;
    isAdmin: boolean;
}

export interface RegisterUser {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

export interface loginData {
    email: string;
    password: string;
}

export interface loginResponse {
    access_token: string;
    token_type: string;
}