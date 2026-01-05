import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addContentToProject } from "../services/project.service";

export function useAddContentToProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addContentToProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}
