"use client";

import { useEffect, useState } from "react";
import { getBooksByStatus } from "@/api";
import type { Book } from "@/types";
import BookCard, { BookCardSkeleton } from "@/components/BookCard";
import SelectedBook, {
  SelectedBookSkeleton,
} from "@/components/SelectedBook";

interface ForYouData {
  selected: Book | null;
  recommended: Book[];
  suggested: Book[];
}

export default function ForYouPage() {
  const [data, setData] = useState<ForYouData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      getBooksByStatus("selected"),
      getBooksByStatus("recommended"),
      getBooksByStatus("suggested"),
    ])
      .then(([selected, recommended, suggested]) => {
        if (!ignore) {
          setData({ selected: selected[0] ?? null, recommended, suggested });
        }
      })
      .catch((err: Error) => {
        if (!ignore) {
          setError(err.message);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const loading = data === null && error === null;

  return (
    <div className="for-you">
      {error && <div className="for-you__error">{error}</div>}

      <section>
        <div className="for-you__title">Selected just for you</div>
        {loading ? (
          <SelectedBookSkeleton />
        ) : (
          data?.selected && <SelectedBook book={data.selected} />
        )}
      </section>

      <section>
        <div className="for-you__title">Recommended For You</div>
        <div className="for-you__subtitle">We think you&apos;ll like these</div>
        <div className="for-you__books">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <BookCardSkeleton key={index} />
              ))
            : data?.recommended.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
        </div>
      </section>

      <section>
        <div className="for-you__title">Suggested Books</div>
        <div className="for-you__subtitle">Browse those books</div>
        <div className="for-you__books">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <BookCardSkeleton key={index} />
              ))
            : data?.suggested.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
        </div>
      </section>
    </div>
  );
}