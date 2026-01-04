import React, { useState } from 'react'
import { useCreatePage } from '../hooks/useCreatePage';

const CreatePage = () => {
    const [title,setTitle] = useState("");
    const [text,setText] = useState("");

    const {mutate,isPending,isError} = useCreatePage();
    function handleSubmit(e: React.FormEvent){
        e.preventDefault();

        mutate({
            title,
            text
        });
    }
  return (
    <div>
      <h2>Create page</h2>
      <form onSubmit={handleSubmit}>
        <input 
            type="text" 
            placeholder='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
        />

        <textarea  
            placeholder='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
        />

        <button disabled={isPending}>
            {isPending ? "Saving.." : "Create"}
        </button>
      </form>

      {isError && <p>Error creating pages</p>}
    </div>
  )
}

export default CreatePage
