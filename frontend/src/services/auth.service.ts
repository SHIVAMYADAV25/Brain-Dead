import { api } from "./api";

type LoginPayload = {
    email : string,
    password : string
}

export async function login(payload:LoginPayload) {
    const response = await api.post("/user/signin",payload);
    return response.data
}
