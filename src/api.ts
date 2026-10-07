import type { Book } from "@/types";

const BASE_URL = "https://us-central1-summaristt.cloudfunctions.net";

async function request(path: string): Promise<unknown> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

function toBooks(data: unknown): Book[] {
  if (Array.isArray(data)) {
    return data as Book[];
  }
  if (data && typeof data === "object") {
    return [data as Book];
  }
  return [];
}

export async function getBooksByStatus(
  status: "selected" | "recommended" | "suggested",
): Promise<Book[]> {
  return toBooks(await request(`/getBooks?status=${status}`));
}

export async function getBook(id: string): Promise<Book | null> {
  const data = await request(`/getBook?id=${encodeURIComponent(id)}`);
  return data && typeof data === "object" ? (data as Book) : null;
}

export async function searchBooks(search: string): Promise<Book[]> {
  const data = await request(
    `/getBooksByAuthorOrTitle?search=${encodeURIComponent(search)}`,
  );
  return Array.isArray(data) ? (data as Book[]) : [];
}