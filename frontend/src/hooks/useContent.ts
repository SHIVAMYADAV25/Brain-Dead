import { useQuery } from "@tanstack/react-query";
import { fetchContent } from "../services/content.service";

export function useContent(){
 
    return useQuery({
        queryKey:["content"],
        queryFn:fetchContent
    })
}