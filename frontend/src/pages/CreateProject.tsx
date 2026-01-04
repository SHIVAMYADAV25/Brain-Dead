import { useState } from "react";
import { useCreateProject } from "../hooks/useCreateProjects";

function CreateProject() {
  const [name, setName] = useState("");
  const { mutate, isPending } = useCreateProject();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    mutate({ name });
  }

  return (
    <div>
      <h2>Create Project</h2>

      <form onSubmit={handleCreate}>
        <input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}

export default CreateProject;
