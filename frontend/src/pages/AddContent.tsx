import { useState } from "react";
import { useAddContent } from "../hooks/useAddContent";

function AddContent() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const { mutate, isPending, isError } = useAddContent();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    mutate({
      title,
      url,
    });
  }

  return (
    <div>
      <h2>Add Content</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Paste URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />

        <button disabled={isPending}>
          {isPending ? "Processing content…" : "Add"}
        </button>
      </form>

      {isPending && (
        <p>
          Extracting content and generating summary.  
          This may take a few seconds.
        </p>
      )}

      {isError && <p>Failed to add content</p>}
    </div>
  );
}

export default AddContent;
