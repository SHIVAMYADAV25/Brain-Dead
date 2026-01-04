import { useEffect, useState } from "react";
import { useUpadtePage } from "../hooks/useUpdatePage";
import { useNavigate, useParams } from "react-router-dom";
import { usePage } from "../hooks/usePage";


function EditPage(){
    const {id} = useParams<{id:string}>();
    const navigate = useNavigate();

    const {data,isLoading} = usePage();
    const {mutate,isPending} = useUpadtePage();

    const page = data?.find((p) => p._id === id) ;
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    useEffect(()=>{
        
        if(page){
            setTitle(page.title)
            setText(page.text)
        }
    },[page])

    if (isLoading) return <p>Loading page...</p>;
    if (!page) return <p>Page not found</p>;

    function handleSave(){
        
        mutate({
            id:page!._id,
            title,
            text
        },
        {
            onSuccess : () =>{
                navigate("/pages");
            }
        }
        )
    }

    return (
        <div>
            <h3>Edit Page</h3>
            <input 
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />

            <textarea 
                value={text}
                onChange={(e)=>setText(e.target.value)}
            />

            <button onClick={handleSave} disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
            </button>
        </div>
    )
}

export default EditPage;