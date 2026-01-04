import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import type React from "react";

type props = {
    children : React.ReactNode
}

function ProtectedRoute({children} : props){
    const token = useAuthStore((state) => state.token);

    if(!token){
        return <Navigate to="/login" replace/>;
    }

    return <>{children}</>
}

export default ProtectedRoute;

// What is happening here
// useAuthStore(...)

//     Reads current token
//     React re-renders if token changes

// if (!token)

//     User is NOT logged in
//     Redirect to /login

// <Navigate />

//     React Router’s way to redirect
//     replace avoids back-button abuse