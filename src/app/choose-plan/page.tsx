"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { AiFillFileText } from "react-icons/ai";
import { BiCrown } from "react-icons/bi";
import { RiLeafLine } from "react-icons/ri";
import { IoChevronDown } from "react-icons/io5";
import { db } from "@/firebase";
import { formatPrice, loadPriceOptions, type PriceOption } from "@/plans";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/modalSlice";
import Skeleton from "@/components/Skeleton";

const features = [
  {
    icon: <AiFillFileText />,
    text: "Key ideas in few min with many books to read",
  },
  {
    icon: <BiCrown />,
    text: "3 million people growing with Summarist everyday",
  },
  {
    icon: <RiLeafLine />,
    text: "Precise recommendations collections curated by experts",
  },
];

const faqs = [
  {
    question: "How does the free 7-day trial work?",
    answer:
      "Start your free 7-day trial with the Premium Plus Yearly plan. You won't be charged until the trial ends, and you can cancel any time before then.",
  },
  {
    question: "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
    answer:
      "Yes. You can change your plan at any time, and the change applies to your next billing period.",
  },
  {
    question: "What's included in the Premium plan?",
    answer:
      "Premium gives you unlimited access to every book summary, in both text and audio, plus personalized recommendations.",
  },
  {
    question: "Can I cancel during my trial or subscription?",
    answer:
      "Yes. You can cancel during your trial and you won't be charged, or cancel your subscription at any time to stop future payments.",
  },
];

type Interval = "year" | "month";

export default function ChoosePlanPage() {
  const dispatch = useAppDispatch();
  const { uid, ready } = useAppSelector((state) => state.user);

  const [options, setOptions] = useState<PriceOption[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [selected, setSelected] = useState<Interval>("year");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    let ignore = false;
    loadPriceOptions()
      .then((data) => {
        if (!ignore) {
          setOptions(data);
        }
      })
      .catch(() => {
        if (!ignore) {
          setLoadError("Could not load plans. Please try again later.");
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const yearly = options?.find((option) => option.interval === "year");
  const monthly = options?.find((option) => option.interval === "month");
  const selectedOption = selected === "year" ? yearly : monthly;
  const loadingPlans = options === null && !loadError;

  async function handleCheckout() {
    if (!selectedOption || !ready) {
      return;
    }
    if (!uid) {
      dispatch(openModal("login"));
      return;
    }

    setCheckingOut(true);
    setCheckoutError("");

    try {
      const sessionRef = await addDoc(
        collection(db, "customers", uid, "checkout_sessions"),
        {
          price: selectedOption.priceId,
          success_url: `${window.location.origin}/settings`,
          cancel_url: window.location.href,
          ...(selected === "year" ? { trial_period_days: 7 } : {}),
        },
      );

      const timeout = setTimeout(() => {
        unsubscribe();
        setCheckoutError("Checkout is taking too long. Please try again.");
        setCheckingOut(false);
      }, 30000);

      const unsubscribe = onSnapshot(sessionRef, (snapshot) => {
        const data = snapshot.data();
        if (data?.error) {
          clearTimeout(timeout);
          unsubscribe();
          setCheckoutError(data.error.message ?? "Something went wrong.");
          setCheckingOut(false);
        } else if (data?.url) {
          clearTimeout(timeout);
          unsubscribe();
          window.location.assign(data.url);
        }
      });
    } catch {
      setCheckoutError("Could not start checkout. Please try again.");
      setCheckingOut(false);
    }
  }

  function planCard(option: PriceOption | undefined, interval: Interval) {
    if (!option) {
      return null;
    }
    const isYear = interval === "year";
    return (
      <button
        className={`plan ${selected === interval ? "plan--selected" : ""}`}
        onClick={() => setSelected(interval)}
      >
        <span className="plan__radio" />
        <span>
          <span className="plan__title">
            {isYear ? "Premium Plus Yearly" : "Premium Monthly"}
          </span>
          <span className="plan__price">
            {formatPrice(option.amount, option.currency)}/
            {isYear ? "year" : "month"}
          </span>
          <span className="plan__text">
            {isYear ? "7-day free trial included" : "No trial included"}
          </span>
        </span>
      </button>
    );
  }

  return (
    <div>
      <header className="choose__header">
        <Link href="/">
          <img src="/assets/logo.png" alt="Summarist" />
        </Link>
      </header>

      <section className="choose__hero">
        <div className="choose__hero-title">
          Get unlimited access to many amazing books to read
        </div>
        <div className="choose__hero-subtitle">
          Turn ordinary moments into amazing learning opportunities
        </div>
        <div className="choose__features">
          {features.map((feature) => (
            <div className="choose__feature" key={feature.text}>
              <div className="choose__feature-icon">{feature.icon}</div>
              <div>{feature.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="choose__plans">
        <div className="choose__section-title">
          Choose the plan that fits you
        </div>

        {loadingPlans ? (
          <>
            <Skeleton height={120} />
            <div className="choose__or">or</div>
            <Skeleton height={120} />
          </>
        ) : loadError ? (
          <div className="choose__error">{loadError}</div>
        ) : (
          <>
            {planCard(yearly, "year")}
            {yearly && monthly && <div className="choose__or">or</div>}
            {planCard(monthly, "month")}
            {!yearly && !monthly && (
              <div className="choose__error">No plans are available yet.</div>
            )}
          </>
        )}

        <div className="choose__cta-wrap">
          <button
            className="choose__cta"
            onClick={handleCheckout}
            disabled={!selectedOption || checkingOut}
          >
            {checkingOut
              ? "Redirecting..."
              : selected === "year"
                ? "Start your free 7-day trial"
                : "Start your first month"}
          </button>
          {checkoutError && <div className="choose__error">{checkoutError}</div>}
          <div className="choose__note">
            {selected === "year"
              ? "Cancel your trial at any time before it ends and you won't be charged."
              : "Cancel anytime. Billed every month."}
          </div>
        </div>
      </section>

      <section className="faq">
        {faqs.map((faq, index) => (
          <div className="faq__item" key={faq.question}>
            <button
              className="faq__question"
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              aria-expanded={openFaq === index}
            >
              <span>{faq.question}</span>
              <IoChevronDown
                className={`faq__icon ${openFaq === index ? "faq__icon--open" : ""}`}
              />
            </button>
            {openFaq === index && <div className="faq__answer">{faq.answer}</div>}
          </div>
        ))}
      </section>

      <footer className="choose__footer">Copyright &copy; 2023 Summarist.</footer>
    </div>
  );
}