import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../services/project.service";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
}
