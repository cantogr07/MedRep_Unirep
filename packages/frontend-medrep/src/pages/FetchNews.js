import { useState, useEffect } from "react"
// import format from "date-fns/format"
// You can use the import above or the one below
import { format } from "date-fns"
import GenerateNews from "../components/generateNews";
import Title from "../components/Title"
import Category from "../components/Category"
import ArticleDisplay from "../components/ArticleDisplay"
import ArticlePage from "./ArticlePage"

export default function FetchNews() {
  const [isLoading, setIsLoading] = useState(true) // loading state
  const [item, setItems] = useState([])


    useEffect(() => {
        setIsLoading(true)
        const generateNews = new GenerateNews(10)
        const articles = generateNews.generate()
        setItems(articles)
        setIsLoading(false)
    }, [])

    
  

  return (
    <>
      <main>
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <>
            <Title />
            <Category />
            <ArticleDisplay items={item} />
            
          </>
        )}
      </main>
    </>
  )
}
