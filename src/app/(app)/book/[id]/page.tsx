"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AiOutlineBulb,
  AiOutlineClockCircle,
  AiOutlineStar,
} from "react-icons/ai";
import { BiMicrophone } from "react-icons/bi";
import { BsBook, BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { getBook } from "@/api";
import { isBookSaved, removeBook, saveBook } from "@/library";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/modalSlice";
import useAudioDuration, { formatDuration } from "@/hooks/useAudioDuration";
import Skeleton from "@/components/Skeleton";
import type { Book } from "@/types";

interface BookResult {
  id: string;
  book: Book | null;
  error: string | null;
}

interface SavedState {
  bookId: string;
  saved: boolean;
}

function BookPageSkeleton() {
  return (
    <div className="book-page">
      <div className="book-page__content">
        <Skeleton height={36} />
        <Skeleton width="40%" height={18} />
        <Skeleton width="70%" height={22} />
        <Skeleton height={80} />
        <Skeleton height={48} />
        <Skeleton height={200} />
      </div>
      <div className="book-page__image-wrapper">
        <Skeleton width={300} height={300} />
      </div>
    </div>
  );
}

export default function BookPage() {
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
  const [savedState, setSavedState] = useState<SavedState | null>(null);
  const [saving, setSaving] = useState(false);
  const [libraryError, setLibraryError] = useState("");

  const loading = result.id !== id;
  const book = loading ? null : result.book;
  const duration = useAudioDuration(book?.audioLink);
  const isSaved =
    uid && book && savedState?.bookId === book.id ? savedState.saved : false;

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
    if (!uid || !book) {
      return;
    }
    let ignore = false;
    isBookSaved(uid, book.id)
      .then((saved) => {
        if (!ignore) {
          setSavedState({ bookId: book.id, saved });
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [uid, book]);

  if (loading) {
    return <BookPageSkeleton />;
  }

  if (!book) {
    return (
      <div className="book-page__error">{result.error ?? "Book not found"}</div>
    );
  }

  function handleOpenPlayer() {
    if (!book || !ready) {
      return;
    }
    if (!uid) {
      dispatch(openModal("login"));
      return;
    }
    if (book.subscriptionRequired && plan === "basic") {
      router.push("/choose-plan");
      return;
    }
    router.push(`/player/${book.id}`);
  }

  async function handleLibrary() {
    if (!book || !ready) {
      return;
    }
    if (!uid) {
      dispatch(openModal("login"));
      return;
    }
    setSaving(true);
    setLibraryError("");
    try {
      if (isSaved) {
        await removeBook(uid, book.id);
        setSavedState({ bookId: book.id, saved: false });
      } else {
        await saveBook(uid, book);
        setSavedState({ bookId: book.id, saved: true });
      }
    } catch {
      setLibraryError("Could not update your library. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="book-page">
      <div className="book-page__content">
        <div className="book-page__title">
          {book.title}
          {book.subscriptionRequired ? " (Premium)" : ""}
        </div>
        <div className="book-page__author">{book.author}</div>
        <div className="book-page__subtitle">{book.subTitle}</div>

        <div className="book-page__line" />

        <div className="book-page__stats">
          <div className="book-page__stat">
            <AiOutlineStar />
            <span>
              {book.averageRating} ({book.totalRating} ratings)
            </span>
          </div>
          <div className="book-page__stat">
            <AiOutlineClockCircle />
            {duration === null ? (
              <Skeleton width={50} height={14} />
            ) : (
              <span>{formatDuration(duration)}</span>
            )}
          </div>
          <div className="book-page__stat">
            <BiMicrophone />
            <span className="book-page__type">{book.type}</span>
          </div>
          <div className="book-page__stat">
            <AiOutlineBulb />
            <span>{book.keyIdeas} Key ideas</span>
          </div>
        </div>

        <div className="book-page__line" />

        <div className="book-page__buttons">
          <button className="book-page__btn" onClick={handleOpenPlayer}>
            <BsBook />
            <span>Read</span>
          </button>
          <button className="book-page__btn" onClick={handleOpenPlayer}>
            <BiMicrophone />
            <span>Listen</span>
          </button>
        </div>

        <button
          className="book-page__library"
          onClick={handleLibrary}
          disabled={saving}
        >
          {isSaved ? <BsBookmarkFill /> : <BsBookmark />}
          <span>
            {isSaved ? "Saved in My Library" : "Add title to My Library"}
          </span>
        </button>
        {libraryError && <div className="book-page__error">{libraryError}</div>}

        <div className="book-page__section-title">{"What's it about?"}</div>
        <div className="book-page__tags">
          {book.tags.map((tag) => (
            <div className="book-page__tag" key={tag}>
              {tag}
            </div>
          ))}
        </div>
        <div className="book-page__description">{book.bookDescription}</div>

        <div className="book-page__section-title">About the author</div>
        <div className="book-page__description">{book.authorDescription}</div>
      </div>

      <figure className="book-page__image-wrapper">
        <img
          className="book-page__image"
          src={book.imageLink}
          alt={book.title}
        />
      </figure>
    </div>
  );
}