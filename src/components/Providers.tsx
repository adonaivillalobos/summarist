"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { store } from "@/redux/store";
import { setUser, type Plan } from "@/redux/userSlice";

function roleToPlan(role: unknown): Plan {
  return role === "premium-plus" || role === "premium" ? role : "basic";
}

function AuthListener() {
  useEffect(() => {
    let unsubscribeSubscriptions: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeSubscriptions) {
        unsubscribeSubscriptions();
        unsubscribeSubscriptions = null;
      }

      if (!user) {
        store.dispatch(setUser(null));
        return;
      }

      const session = { uid: user.uid, email: user.email };
      const subscriptionsQuery = query(
        collection(db, "customers", user.uid, "subscriptions"),
        where("status", "in", ["trialing", "active"]),
      );

      unsubscribeSubscriptions = onSnapshot(
        subscriptionsQuery,
        (snapshot) => {
          let plan: Plan = "basic";
          snapshot.forEach((subscription) => {
            const next = roleToPlan(subscription.data().role);
            if (next === "premium-plus" || (next === "premium" && plan === "basic")) {
              plan = next;
            }
          });
          store.dispatch(setUser({ ...session, plan }));
        },
        () => store.dispatch(setUser({ ...session, plan: "basic" })),
      );
    });

    return () => {
      if (unsubscribeSubscriptions) {
        unsubscribeSubscriptions();
      }
      unsubscribeAuth();
    };
  }, []);

  return null;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthListener />
      {children}
    </Provider>
  );
}