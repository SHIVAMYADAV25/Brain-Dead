import { useMutation,useQueryClient } from "@tanstack/react-query";
import { addContent } from "../services/content.service";

export function useAddContent(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : addContent,

        onSuccess:() =>{
            queryClient.invalidateQueries({
                queryKey : ["content"],
            })
        }
    })
}

