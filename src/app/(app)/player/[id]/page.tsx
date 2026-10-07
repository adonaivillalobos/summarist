"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBook } from "@/api";
import { markFinished } from "@/library";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/modalSlice";
import AudioPlayer from "@/components/AudioPlayer";
import Skeleton from "@/components/Skeleton";
import type { Book } from "@/types";

interface BookResult {
  id: string;
  book: Book | null;
  error: string | null;
}

function PlayerSkeleton() {
  return (
    <div className="player-page">
      <Skeleton height={32} />
      <div className="player-page__skeleton-lines">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} height={16} />
        ))}
      </div>
    </div>
  );
}

export default function PlayerPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { uid, ready, plan } = useAppSelector((state) => state.user);

  const [result, setResult] = useState<BookResult>({
    id: "",
    book: null,
    error: null,
  });

  const loading = result.id !== id;
  const book = loading ? null : result.book;
  const needsPlan = !!book && book.subscriptionRequired && plan === "basic";

  useEffect(() => {
    let ignore = false;
    getBook(id)
      .then((data) => {
        if (!ignore) {
          setResult({
            id,
            book: data,
            error: data ? null : "Book not found",
          });
        }
      })
      .catch((err: Error) => {
        if (!ignore) {
          setResult({ id, book: null, error: err.message });
        }
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    if (ready && uid && needsPlan) {
      router.replace("/choose-plan");
    }
  }, [ready, uid, needsPlan, router]);

  if (loading || !ready) {
    return <PlayerSkeleton />;
  }

  if (!uid) {
    return (
      <div className="player-page__login">
        <div className="player-page__login-text">
          Log in to read or listen to this book.
        </div>
        <button
          className="player-page__login-btn"
          onClick={() => dispatch(openModal("login"))}
        >
          Login
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="player-page__error">
        {result.error ?? "Book not found"}
      </div>
    );
  }

  if (needsPlan) {
    return <PlayerSkeleton />;
  }

  function handleEnded() {
    if (uid && book) {
      markFinished(uid, book).catch(() => {});
    }
  }

  return (
    <div className="player-page">
      <div className="player-page__title">{book.title}</div>
      <div className="player-page__summary">{book.summary}</div>
      <AudioPlayer book={book} onEnded={handleEnded} />
    </div>
  );
}