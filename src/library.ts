import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import type { Book } from "@/types";

export async function isBookSaved(uid: string, bookId: string) {
  const snapshot = await getDoc(doc(db, "users", uid, "library", bookId));
  return snapshot.exists();
}

export async function saveBook(uid: string, book: Book) {
  await setDoc(doc(db, "users", uid, "library", book.id), {
    ...book,
    savedAt: Date.now(),
  });
}

export async function removeBook(uid: string, bookId: string) {
  await deleteDoc(doc(db, "users", uid, "library", bookId));
}

export async function markFinished(uid: string, book: Book) {
  await setDoc(doc(db, "users", uid, "finished", book.id), {
    ...book,
    finishedAt: Date.now(),
  });
}