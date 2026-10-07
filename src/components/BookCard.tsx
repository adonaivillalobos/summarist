"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { AiOutlineClockCircle, AiOutlineStar } from "react-icons/ai";
import type { Book } from "@/types";
import useAudioDuration, { formatDuration } from "@/hooks/useAudioDuration";
import Skeleton from "./Skeleton";

export function BookCardSkeleton() {
  return (
    <div className="book-card book-card--skeleton">
      <Skeleton height={172} />
      <Skeleton height={16} />
      <Skeleton width="60%" height={14} />
      <Skeleton height={14} />
    </div>
  );
}

export default function BookCard({ book }: { book: Book }) {
  const duration = useAudioDuration(book.audioLink);

  return (
    <Link href={`/book/${book.id}`} className="book-card">
      {book.subscriptionRequired && (
        <div className="book-card__pill">Premium</div>
      )}
      <figure className="book-card__img--wrapper">
        <img className="book-card__img" src={book.imageLink} alt={book.title} />
      </figure>
      <div className="book-card__title">{book.title}</div>
      <div className="book-card__author">{book.author}</div>
      <div className="book-card__subtitle">{book.subTitle}</div>
      <div className="book-card__meta">
        <span className="book-card__meta-item">
          <AiOutlineClockCircle />
          {duration === null ? (
            <Skeleton width={36} height={12} />
          ) : (
            <span>{formatDuration(duration)}</span>
          )}
        </span>
        <span className="book-card__meta-item">
          <AiOutlineStar />
          <span>{book.averageRating}</span>
        </span>
      </div>
    </Link>
  );
}