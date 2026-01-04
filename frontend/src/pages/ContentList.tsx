import { useContent } from "../hooks/useContent";

function ContentList() {
  const { data, isLoading, isError } = useContent();

  if (isLoading) return <p>Loading content…</p>;
  if (isError) return <p>Failed to load content</p>;

  return (
    <div>
      <h2>Your Content</h2>

      {data.map((item: any) => (
        <div key={item._id}>
          <h4>{item.title}</h4>
          <p>{item.summary}</p>
          <small>Type: {item.type}</small>
        </div>
      ))}
    </div>
  );
}

export default ContentList;
