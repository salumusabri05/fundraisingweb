"use client";
import React, { useState } from "react";

export default function SearchBar({ placeholder = "Search fundraisers, scholarships, or events..." }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement your search logic here, for example, redirect to a search results page
        console.log("Searching for:", query);
    };

    return (
        <form onSubmit={handleSubmit} className="flex">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500"
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none"
            >
                Search
            </button>
        </form>
    );
}