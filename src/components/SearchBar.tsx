"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import useDebounce from "@/hooks/useDebounce";
import { searchBooks } from "@/api";
import type { Book } from "@/types";
import Skeleton from "./Skeleton";

interface SearchResult {
  query: string;
  books: Book[];
  error: string | null;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [result, setResult] = useState<SearchResult>({
    query: "",
    books: [],
    error: null,
  });

  const searchTerm = debouncedQuery.trim();
  const showResults = query.trim() !== "" && searchTerm !== "";
  const loading = showResults && result.query !== searchTerm;

  useEffect(() => {
    if (searchTerm === "") {
      return;
    }
    let ignore = false;
    searchBooks(searchTerm)
      .then((books) => {
        if (!ignore) {
          setResult({ query: searchTerm, books, error: null });
        }
      })
      .catch((err: Error) => {
        if (!ignore) {
          setResult({ query: searchTerm, books: [], error: err.message });
        }
      });
    return () => {
      ignore = true;
    };
  }, [searchTerm]);

  return (
    <div className="search">
      <div className="search__input--wrapper">
        <input
          className="search__input"
          type="text"
          placeholder="Search for books"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="search__icon">
          {query ? (
            <button
              className="search__clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <IoClose />
            </button>
          ) : (
            <BiSearch />
          )}
        </div>
      </div>

      {showResults && (
        <div className="search__results">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div className="search__result" key={index}>
                <Skeleton width={50} height={50} />
                <div className="search__result--text">
                  <Skeleton height={14} />
                  <Skeleton width="60%" height={12} />
                </div>
              </div>
            ))
          ) : result.error ? (
            <div className="search__message">{result.error}</div>
          ) : result.books.length === 0 ? (
            <div className="search__message">No books found</div>
          ) : (
            result.books.map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                className="search__result"
                onClick={() => setQuery("")}
              >
                <img
                  className="search__result--img"
                  src={book.imageLink}
                  alt={book.title}
                />
                <div className="search__result--text">
                  <div className="search__result--title">{book.title}</div>
                  <div className="search__result--author">{book.author}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}