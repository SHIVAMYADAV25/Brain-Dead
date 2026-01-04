import { api } from "./api";

export type page = {
    _id : string;
    title : string;
    text : string;
};

export async function fetchPages():Promise<page[]>{
    const res = await api.get("page/pages");
    return res.data.data
}

export async function createPage(payload:{title : string;text : string}){
    const res = await api.post("/page/add",payload);
    return res.data;
}


export async function updatePage(payload:{id:string,title?:string,text?:string}) {
    const {id, ...body} = payload;
    const res = await api.patch(`/pages/${id}`,body);
    return res.data
}

// create page function
// create hook
// call it 
// create UI