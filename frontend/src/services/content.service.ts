import { api } from "./api";

export type content = {
    id: string,
    title : string,
    summary : string,
    type : string,
    URL : string
}

export async function addContent(payload:{title:string,url:string}) {
    const res = await api.post("/content",payload);
    return res.data
}

export async function fetchContent() {
    const res = await api.get("/content");
    return res.data
}