import ArticlePage from "./pages/ArticlePage"
import FetchNews from "./pages/FetchNews"
import { BrowserRouter, Routes, Route } from 'react-router-dom'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<FetchNews />}></Route>
        <Route path="/article" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  )
}
