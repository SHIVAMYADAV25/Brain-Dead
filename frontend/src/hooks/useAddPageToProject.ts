import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPageToProject } from "../services/project.service";

export function useAddPageToProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPageToProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}
