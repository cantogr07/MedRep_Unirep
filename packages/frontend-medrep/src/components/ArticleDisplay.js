import React from 'react'
import { useState, useEffect } from "react"
import GenerateNews from './generateNews'
import { format } from "date-fns"
import { useLocation } from 'react-router-dom'
import setItems from "./ArticleDisplay"
import { Link } from 'react-router-dom'


const ArticleDisplay = ({items}) => {

    const { epochKey, created_at, objectID, title, upvotes, downvotes, demonstratedReputation } = items

    return (
        <section className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 container mx-auto lg:max-w-4xl">
            {items.map((item) => {
                const { epochKey, created_at, objectID, title, url, upvotes, downvotes, demonstratedReputation } = item

                return (
                    <article
                        key={objectID}
                        className="bg-gray-800 rounded p-3 transition-all duration-150"
                    >
                        <h3 className="font-bold text-white text-lg mb-3">
                            {`#${objectID + 1}`}
                        </h3>
                        <h3 className="font-bold text-white text-lg mb-3">
                            {title}
                        </h3>
                        <article className="flex items-center justify-between">
                            <p className="text-gray-600">
                                By <em>{epochKey}</em>
                            </p>
                            <Link to="/article" state={{ items: item }} className="article-link" >
                                Click for Article👆
                            </Link >
                        </article>
                        <p className="text-gray-400 mt-10">
                            {/* Format date using the `format` method from `date-fns` */}
                            {format(new Date(created_at), "dd MMM yyyy")}
                        </p>

                        <div className="flex justify-between">
                            <p className="text-gray-400 mt-10 mr-2">
                                Upvotes: {item.upvotes} Downvotes: {item.downvotes}
                            </p>
                            <p className="text-gray-400 mt-10 mr-2">
                                Reputation: {item.demonstratedReputation}
                            </p>
                            

                        </div>


                    </article>
                )
            })}
        </section>
    )
}

export default ArticleDisplay