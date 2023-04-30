import React from 'react'
import { faker } from '@faker-js/faker';
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from 'react-router-dom'
import GenerateNews from "../components/generateNews";

// demonstrated reputation
// epoch key

// article text (full)
// upvote/downvote logic

// credibility rating qs
// contest mechanism

// return to main page


const ArticlePage = ({ items }) => {
    const [articleText, setArticleText] = useState('');
    const [isLoading, setIsLoading] = useState(true) // loading state
    const [item, setItems] = useState([])



    useEffect(() => {
        console.log("useEffect called")
        setIsLoading(true)
        const generateNews = new GenerateNews(10)
        const articles = generateNews.generate()
        setItems(articles)
        setIsLoading(false)
        setArticleText(faker.lorem.paragraphs());

    }, [])


    //const {state} = useLocation().state.items;
    //items = state.items;
    //const selectedItem = state.items;

    //console.log(selectedItem)

    //const { epochKey, created_at, objectID, title, upvotes, downvotes, demonstratedReputation } = items
    //console.log(selectedItem)



    const [rating1, setRating1] = useState(0);
    const [rating2, setRating2] = useState(0);
    const [rating3, setRating3] = useState(0);
    const [rating4, setRating4] = useState(0);



    const handleVote = (id, value) => {
        const updatedItems = items.map((item) => {
            if (item.objectID === id) {
                if (value === "up") {
                    return { ...item, upvotes: item.upvotes + 1 }
                }
                else if (value === "down") {
                    return { ...item, downvotes: item.downvotes + 1 }
                } else {
                    return item
                }
            } else {
                return item
            }

        })
        setItems(updatedItems)
    }


    return (
        <div className="bg-gray-100">
            <nav className="flex justify-between items-center bg-gray-900 p-4">
                <div className="text-white">
                    User's Demonstrated Reputation: {}
                </div>
                <div className="text-white">
                    Epoch Key of User: {}
                </div>
            </nav>
            <article className="p-4 article">
                <p className="text-xl">{articleText}</p>
                <div className="flex justify-end">
                    <div className="flex items-center mr-4">
                        <button
                            className="upvote"
                            onClick={() => handleVote(item.objectID, "up")}
                        >
                            Upvote
                        </button>
                        <span className="ml-2">{item.upvotes}</span>
                    </div>
                    <div className="flex items-center">
                        <button
                            className="downvote"
                            onClick={() => handleVote(item.objectID, "down")}
                        >
                            Downvote
                        </button>
                        <Link to="/" className="return">Go back</Link>
                        <span className="ml-2">{item.downvotes}</span>
                    </div>
                </div>
            </article>
            <footer className="bg-gray-200 py-4 px-6 fixed bottom-0 left-0 w-full">
                <h2 className="text-lg font-bold mb-4">Please rate this article:</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between items-center">
                        <label htmlFor="rating1">This article is credible.</label>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            value={rating1}
                            onChange={(event) => setRating1(Number(event.target.value))}
                            id="rating1"
                            className="w-3/5"
                        />
                        <span>{rating1}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="rating2">The article provides factual information.</label>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            value={rating2}
                            onChange={(event) => setRating2(Number(event.target.value))}
                            id="rating2"
                            className="w-3/5"
                        />
                        <span>{rating2}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="rating3">The article doesn't lean on any side.</label>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            value={rating3}
                            onChange={(event) => setRating3(Number(event.target.value))}
                            id="rating3"
                            className="w-3/5"
                        />
                        <span>{rating3}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="rating4">The writer's reputation proves that they're somewhat reputable.</label>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            value={rating4}
                            onChange={(event) => setRating4(Number(event.target.value))}
                            id="rating4"
                            className="w-3/5"
                        />
                        <span>{rating4}</span>
                    </div>
                </div>
            </footer>
        </div>



    )
}

export default ArticlePage