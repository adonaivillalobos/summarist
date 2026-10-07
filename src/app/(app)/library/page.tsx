"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FaUserCircle } from "react-icons/fa";
import { db } from "@/firebase";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/modalSlice";
import BookCard, { BookCardSkeleton } from "@/components/BookCard";
import Skeleton from "@/components/Skeleton";
import type { Book } from "@/types";

type StoredBook = Book & { savedAt?: number; finishedAt?: number };

interface LibraryData {
  uid: string;
  saved: StoredBook[];
  finished: StoredBook[];
  error: string | null;
}

async function loadBooks(
  uid: string,
  name: "library" | "finished",
): Promise<StoredBook[]> {
  const snapshot = await getDocs(collection(db, "users", uid, name));
  return snapshot.docs
    .map((item) => item.data() as StoredBook)
    .sort(
      (a, b) =>
        (b.savedAt ?? b.finishedAt ?? 0) - (a.savedAt ?? a.finishedAt ?? 0),
    );
}

function LibrarySection({
  title,
  books,
  emptyTitle,
  emptyText,
}: {
  title: string;
  books: StoredBook[];
  emptyTitle: string;
  emptyText: string;
}) {
  return (
    <section className="library__section">
      <div className="library__title">{title}</div>
      <div className="library__count">
        {books.length} {books.length === 1 ? "item" : "items"}
      </div>
      {books.length === 0 ? (
        <div className="library__empty">
          <div className="library__empty-title">{emptyTitle}</div>
          <div>{emptyText}</div>
        </div>
      ) : (
        <div className="for-you__books">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function LibraryPage() {
  const dispatch = useAppDispatch();
  const { uid, ready } = useAppSelector((state) => state.user);
  const [data, setData] = useState<LibraryData | null>(null);

  useEffect(() => {
    if (!uid) {
      return;
    }
    let ignore = false;
    Promise.all([loadBooks(uid, "library"), loadBooks(uid, "finished")])
      .then(([saved, finished]) => {
        if (!ignore) {
          setData({ uid, saved, finished, error: null });
        }
      })
      .catch(() => {
        if (!ignore) {
          setData({
            uid,
            saved: [],
            finished: [],
            error: "Could not load your library. Please try again.",
          });
        }
      });
    return () => {
      ignore = true;
    };
  }, [uid]);

  const loading = !ready || (!!uid && data?.uid !== uid);

  if (ready && !uid) {
    return (
      <div className="settings__login">
        <div className="settings__login-icon">
          <FaUserCircle />
        </div>
        <div className="settings__login-text">
          Log in to your account to see your library
        </div>
        <button
          className="settings__btn"
          onClick={() => dispatch(openModal("login"))}
        >
          Login
        </button>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="library">
        <Skeleton width={180} height={28} />
        <div className="for-you__books library__skeleton">
          {Array.from({ length: 4 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="library">
      {data.error && <div className="for-you__error">{data.error}</div>}
      <LibrarySection
        title="Saved Books"
        books={data.saved}
        emptyTitle="Save your favorite books!"
        emptyText="When you save a book, it will appear here."
      />
      <LibrarySection
        title="Finished"
        books={data.finished}
        emptyTitle="Done and dusted!"
        emptyText="When you finish a book, you can find it here later."
      />
    </div>
  );
}