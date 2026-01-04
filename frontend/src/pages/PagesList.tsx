import { useDeletePage } from "../hooks/useDeletePage";
import { usePage } from "../hooks/usePage"
import { useAddPageToProject } from "../hooks/useAddPageToProject";
import { useProjects } from "../hooks/useProjects";
import { useState } from "react";
import { Link } from "react-router-dom";

const PagesList = () => {

    const { data: projects } = useProjects();
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");
    const { data,isLoading,isError } = usePage();
    const {mutate : deletePage,isPending} = useDeletePage();
    const { mutate } = useAddPageToProject();


    if(isLoading) return <p> pages.... </p>
    if(isError) return <p>Falied to load data</p>

  return (
    <div>
      <h1>Your pages</h1>
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

      {data?.map((page)=>(
        <div key={page._id}>
            <h3>{page.title}</h3>
            <p>{page.text}</p>
            {/* Edit button */}
            <Link to={`/pages/${page._id}/edit`}>
              <button>Edit Page</button>
            </Link>    
            <button onClick={() => deletePage(page._id)} disabled={isPending}>
            delete
            </button> 
            <button
              onClick={() =>
                mutate({
                  projectId: selectedProjectId,
                  pageId: page._id,
                })
              }
            >Add to Project</button>
            
        </div>
      ))}
    </div>
  )
}

export default PagesList
