import { useState } from "react";
import { useContent } from "../hooks/useContent";
import { useProjects } from "../hooks/useProjects";
import { useAddContentToProject } from "../hooks/useAddContentToProject";

function ContentList() {
  const { data: projects } = useProjects();
  const { data, isLoading, isError } = useContent();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const {mutate} = useAddContentToProject();

  if (isLoading) return <p>Loading content…</p>;
  if (isError) return <p>Failed to load content</p>;

  if (!data || data.length === 0) {
    return <p>No content added yet.</p>;
  }

  return (
    <div>
      <h2>Your Content</h2>
      <select
        value={selectedProjectId}
        onChange={(e) => setSelectedProjectId(e.target.value)}
      >
        <option value="">Select Project</option>
        {projects?.map((project) => (
          <option key={project._id} value={project._id}>
            {project.name}
          </option>
        ))}
      </select>


      {data.map((item:any) => (
        <div key={item._id}>
          <h4>{item.title}</h4>
          <p>{item.summary}</p>
          <small>Type: {item.type}</small>

          <button
              onClick={() =>
                mutate({
                  projectId: selectedProjectId,
                  contentId: item._id,
                })
              }
            >Add to Project</button>

        </div>
      ))}
    </div>
  );
}

export default ContentList;
