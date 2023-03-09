import React, { useState } from "react"
import Axios from "axios"
import { setupCache } from "axios-cache-adapter"
import "./App.css"

function App() {
  // State
  const [articles, setArticles] = useState([])
  const [searched, setSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchNumber, setSearchNumber] = useState("")
  const [searchCountry, setSearchCountry] = useState("")

  // GNews API: https://gnews.io/
  const API_KEY = process.env.REACT_APP_API_KEY
  const postNum = searchNumber ? searchNumber : "9"
  const keyWords = searchQuery ? searchQuery : "example"
  const country = searchCountry ? searchCountry : "us"
  const URL = `https://gnews.io/api/v4/search?q=${keyWords}&in=${keyWords}&country=${country}&max=${postNum}&apikey=${API_KEY}`

  // Cache from axios-cache-adapter package setting cache for 15min
  const cache = setupCache({
    maxAge: 15 * 60 * 1000
  })

  // Axios with cache
  const api = Axios.create({
    adapter: cache.adapter
  })

  // Form submit
  const handleSubmit = e => {
    e.preventDefault()
    api
      .get(URL)
      .then(response => {
        setArticles(response.data.articles)
        setSearched(true)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const showArticles = () => {
    if (searched) {
      return articles.map(article => (
        <div key={article.url} className="single-article">
          <img src={article.image} alt={article.title} />
          <h3>{article.title}</h3>
          <p>{article.description.split(" ").slice(0, 25).join(" ")}...</p>
          <a href={article.url} target="_blank" rel="noreferrer">
            Read More
          </a>
        </div>
      ))
    } else {
      return (
        <div>
          <p>Please search a query to show articles</p>
        </div>
      )
    }
  }

  return (
    <div className="App">
      <div className="search-area">
        <h1>Search for News!</h1>
        <form className="form">
          <label htmlFor="search">
            Search:
            <input
              type="text"
              placeholder="title, author, keyword, etc..."
              onChange={e => setSearchQuery(e.target.value)}
            />
          </label>
          <label htmlFor="Number">
            Number of articles:
            <input
              type="number"
              placeholder="Number"
              min={1}
              max={15}
              onChange={e => setSearchNumber(e.target.value)}
            />
          </label>
          <label htmlFor="country">
            Country:
            <select value={searchCountry} onChange={e => setSearchCountry(e.target.value)}>
              <option value="null">All</option>
              <option value="au">Australia</option>
              <option value="cn">China</option>
              <option value="in">India</option>
              <option value="gb">United Kingdom</option>
              <option value="us">United States</option>
            </select>
          </label>
          <button onClick={handleSubmit}>Search</button>
        </form>
      </div>
      <div className="articles">{showArticles()}</div>
    </div>
  )
}

export default App
