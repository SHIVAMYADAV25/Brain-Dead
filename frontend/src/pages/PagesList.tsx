import { useDeletePage } from "../hooks/useDeletePage";
import { usePage } from "../hooks/usePage"

const PagesList = () => {

    const { data,isLoading,isError } = usePage();
    const {mutate : deletePage,isPending} = useDeletePage();


    if(isLoading) return <p> pages.... </p>
    if(isError) return <p>Falied to load data</p>

  return (
    <div>
      <h1>Your pages</h1>
      {data?.map((page)=>(
        <div key={page._id}>
            <h3>{page.title}</h3>
            <p>{page.text}</p>    
            <button onClick={() => deletePage(page._id)} disabled={isPending}>
            delete
            </button> 
        </div>
      ))}
    </div>
  )
}

export default PagesList
