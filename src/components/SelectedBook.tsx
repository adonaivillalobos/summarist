"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { AiOutlineClockCircle } from "react-icons/ai";
import type { Book } from "@/types";
import useAudioDuration, { formatDuration } from "@/hooks/useAudioDuration";
import Skeleton from "./Skeleton";

export function SelectedBookSkeleton() {
  return (
    <div className="selected-book selected-book--skeleton">
      <div className="selected-book__subtitle">
        <Skeleton height={80} />
      </div>
      <div className="selected-book__line" />
      <div className="selected-book__content">
        <Skeleton width={140} height={140} />
        <div className="selected-book__text">
          <Skeleton width={120} height={16} />
          <Skeleton width={80} height={14} />
        </div>
      </div>
    </div>
  );
}

export default function SelectedBook({ book }: { book: Book }) {
  const duration = useAudioDuration(book.audioLink);

  return (
    <Link href={`/book/${book.id}`} className="selected-book">
      <div className="selected-book__subtitle">{book.subTitle}</div>
      <div className="selected-book__line" />
      <div className="selected-book__content">
        <figure className="selected-book__img--wrapper">
          <img src={book.imageLink} alt={book.title} />
        </figure>
        <div className="selected-book__text">
          <div className="selected-book__title">{book.title}</div>
          <div className="selected-book__author">{book.author}</div>
          <div className="selected-book__duration">
            <AiOutlineClockCircle />
            {duration === null ? (
              <Skeleton width={40} height={12} />
            ) : (
              <span>{formatDuration(duration)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}