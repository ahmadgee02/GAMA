import type { loginData, loginResponse } from "@/app/types"
import http from "./core/httpService";

export const loginService = async (data: loginData): Promise<loginResponse> => {
  try {
    const response = await http.post('/auth/login', data);

    return response.data;
  } catch (error) {
    return null!
  }
}