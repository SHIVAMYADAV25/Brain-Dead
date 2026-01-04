import { useMutation,useQueryClient } from "@tanstack/react-query";
import { createPage } from "../services/page.service";

export function useCreatePage(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : createPage,

        onSuccess:() =>{
            queryClient.invalidateQueries({
                queryKey : ["pages"],
            })
        }
    })
}

// useMutation
//     Used for POST / PATCH / DELETE
//     Does NOT auto run
//     Runs only when you call mutate()

// queryClient.invalidateQueries(["pages"])    
// Means:
//     “Hey React Query, the pages list is outdated. Fetch it again.”