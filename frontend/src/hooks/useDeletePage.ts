import { useMutation , useQueryClient } from "@tanstack/react-query";
import { deletePage } from "../services/page.service";

export function useDeletePage(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePage,

        onSuccess:() => {
            queryClient.invalidateQueries({
                queryKey : ["pages"],
            })
        }
    })
}