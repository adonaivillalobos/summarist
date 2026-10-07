import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";

export interface PriceOption {
  priceId: string;
  productName: string;
  interval: "year" | "month";
  amount: number;
  currency: string;
}

export async function loadPriceOptions(): Promise<PriceOption[]> {
  const products = await getDocs(
    query(collection(db, "products"), where("active", "==", true)),
  );
  const options: PriceOption[] = [];

  for (const product of products.docs) {
    const prices = await getDocs(
      query(collection(product.ref, "prices"), where("active", "==", true)),
    );
    prices.forEach((price) => {
      const data = price.data();
      if (data.interval === "year" || data.interval === "month") {
        options.push({
          priceId: price.id,
          productName: product.data().name ?? "",
          interval: data.interval,
          amount: data.unit_amount ?? 0,
          currency: data.currency ?? "usd",
        });
      }
    });
  }

  return options;
}

export function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}