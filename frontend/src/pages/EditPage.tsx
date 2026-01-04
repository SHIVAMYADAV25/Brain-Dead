import { useState } from "react";
import { useUpadtePage } from "../hooks/useUpdatePage";

type props = {
    pageId : string,
    initialTitle : string,
    initialText : string
};

function EditPage({pageId,initialText,initialTitle}:props){
    const [title,setTitle] = useState(initialTitle);
    const [text,setText] = useState(initialText);

    const {mutate,isPending} = useUpadtePage();

    function handleSave(){
        mutate({
            id:pageId,
            title,
            text
        });
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