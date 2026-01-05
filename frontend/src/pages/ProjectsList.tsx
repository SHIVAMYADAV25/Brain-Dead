import { useProjects } from "../hooks/useProjects";

function ProjectsList() {
  const { data, isLoading, isError } = useProjects();

  if (isLoading) return <p>Loading projects...</p>;
  if (isError) return <p>Failed to load projects</p>;

  return (
    <div>
      <h2>Your Projects</h2>

      {data!.map((project) => (
        <div key={project._id}>
          <h4>{project.name}</h4>
          <p>Pages: {project.pageIds}</p>
          <p>Content: {project.contentIds.length}</p>
        </div>
      ))}
    </div>
  );
}

export default ProjectsList;
