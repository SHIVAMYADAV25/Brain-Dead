import { create } from "zustand";
import { persist } from "zustand/middleware"

type AuthState = {
    token : string | null;

    setToken : (token : string) => void;

    logout : () => void
}

// Creates a global store you can use in ANY component.
export const useAuthStore = create<AuthState>()(
    // Means:
    //     Refresh page
    //     Token still exists
    //     No refresh = logout problems.
    persist(
        (set) => ({
            token : null,

            setToken : (token) => set({token}), //Called after login success.

            logout : () => set({token : null}),
        }),
        {
            name : "auth-storage" // localStorage key
        }
    )
);