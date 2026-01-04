import { api } from "./api";

export type Project = {
    _id : string;
    name : string;
    contentIds : string[];
    pageIds : string[];
};

export async function fetchProjects():Promise<Project[]> {
    const res = await api.get("/projects");
    return res.data.data    
}

export async function createProject(payload:{name:string}) {
    const res = await api.post('/pojects',payload);
    return res.data.data
}

export async function addPageToProject(payload: {
  projectId: string;
  pageId: string;
}) {
  const res = await api.post(
    `/projects/${payload.projectId}/add-page`,
    { pageId: payload.pageId }
  );
  return res.data;
}


export async function addContentToProject(payload: {
  projectId: string;
  contentId: string;
}) {
  const res = await api.post(
    `/projects/${payload.projectId}/add-content`,
    { contentId: payload.contentId }
  );
  return res.data;
}

