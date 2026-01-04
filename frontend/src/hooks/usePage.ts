import { useQuery } from "@tanstack/react-query";
import { fetchPages } from "../services/page.service";

export function usePage(){
    return useQuery({
        queryKey : ["pages"],
        queryFn : fetchPages
    })
}

// queryKey: ["pages"]
//     Unique identity for this data
//     Used for caching & invalidation

// queryFn
//     Function that fetches data
//     React Query calls it when needed

// React Query handles:
//     loading
//     error
//     caching
//     refetch
