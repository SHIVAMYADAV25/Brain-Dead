import axios from "axios";
import { useAuthStore } from "../store/auth.store";

export const api = axios.create({
    baseURL : "http://127.0.0.1:3000/api/v1",
    headers : {
        "Content-Type":"application/json",
    }
})

api.interceptors.request.use((config) =>{
    const token = useAuthStore.getState().token;

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// Flow:
//     Backend returns 401 Unauthorized
//     Axios catches it
//     Zustand logout() clears token
//     User is redirected to /login

api.interceptors.response.use(
    (response) => response,
    (error) =>{
        if(error.response?.status === 401){
            useAuthStore.getState().logout();
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);