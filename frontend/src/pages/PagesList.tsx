import { usePage } from "../hooks/usePage"

const PagesList = () => {

    const { data,isLoading,isError } = usePage();

    if(isLoading) return <p> pages.... </p>
    if(isError) return <p>Falied to load data</p>

  return (
    <div>
      <h1>Your pages</h1>
      {data?.map((page)=>(
        <div key={page._id}>
            <h3>{page.title}</h3>
            <p>{page.text}</p>     
        </div>
      ))}
    </div>
  )
}

export default PagesList
