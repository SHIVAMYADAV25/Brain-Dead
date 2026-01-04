import { useMutation , useQueryClient } from "@tanstack/react-query";
import { updatePage } from "../services/page.service";

export function useUpadtePage(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : updatePage,

        onSuccess : () =>{
            queryClient.invalidateQueries({
                queryKey : ["pages"],
            })
        }
    })
}