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

// What create() actually does :
//     It creates one store object
//     That store lives outside React
//     React components can read from it and update it

// Key thing: set is a function
//     Zustand gives you set.
//     You do NOT create it.
//     Zustand injects it.


// What happens when you call setToken("abc")
// Step-by-step:

// You call:
//     setToken("abc")

// That runs:
//     set({ token: "abc" })

// Zustand internally:
//     Merges { token: "abc" } into the store
//     Notifies all components using this store
//     React re-renders them

// So effectively:
//     state.token = "abc";


// VERY IMPORTANT TRUTH

// 👉 setToken and logout are not special keywords
// 👉 They are just functions you defined

// Zustand does NOT care about their names.

// You could write:
    // banana: (x) => set({ token: x })

// PART 4 — How React reads from Zustand

// In your component:
//     const setToken = useAuthStore((state) => state.setToken);

// What this means:
//     useAuthStore is a hook
//     You pass a selector function
//     Zustand gives you only that part of the store

// Equivalent to:
//     const store = useAuthStore();
//     const setToken = store.setToken;

// PART 5 — Now the scary part: api.interceptors.request.use

// Let’s demystify this.

// First: what is an interceptor?
//     Interceptor = a function that runs BEFORE a request is sent

// Timeline:
//     React → api.get(...) → interceptor → request sent → backend


// So Axios gives you a hook into the request pipeline.

// This code again
// api.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().token;

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });


// Let’s break this line by line.
// api.interceptors.request.use(...)

// This means:
//     “Before ANY request using api goes out, run this function”

// It runs for:
//     /pages
//     /chat
//     /projects
//     everything

// What is config?
//     config is just a plain object:
//     {
//     url: "/pages",
//     method: "get",
//     headers: {},
//     data: ...
//     }


// Axios builds this internally and hands it to you.

// What is useAuthStore.getState()?

// ⚠️ This is VERY important.
// Two ways to use Zustand:
// Inside React components

// useAuthStore(...)


// Outside React (services, interceptors)
// useAuthStore.getState()
// Axios interceptor is NOT a React component.
// So we use getState().

// This gives you:
//     {
//     token: "abc",
//     setToken: fn,
//     logout: fn
//     }

// What happens inside interceptor

// Step-by-step:
//     Request starts
//     Interceptor runs

// It asks Zustand:
//     what is the current token?
//         If token exists:
//         Authorization: Bearer abc


// Modified config is returned
// Axios sends request

// Backend now sees:
//     Authorization: Bearer abc

// Why return config is REQUIRED

// Axios expects the interceptor to return:
//     the config → request continues
//     or throw → request fails

// If you forget to return:
//     ❌ request never leaves browser

// PART 6 — How everything connects (MENTAL MAP)
// LoginPage
//    ↓
// login()
//    ↓
// setToken("abc")
//    ↓
// Zustand store updated
//    ↓
// Axios interceptor reads token
//    ↓
// Every API call gets Authorization header


// This is clean architecture.