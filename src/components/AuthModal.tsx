"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaUser } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { auth } from "@/firebase";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { closeModal, setView, type ModalView } from "@/redux/modalSlice";

const GUEST_EMAIL = "guest@gmail.com";
const GUEST_PASSWORD = "guest123";

const titles: Record<ModalView, string> = {
  login: "Log in to Summarist",
  register: "Sign up to Summarist",
  reset: "Reset your password",
};

function getErrorMessage(code: string) {
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email";
    case "auth/missing-email":
      return "Please enter your email";
    case "auth/weak-password":
      return "Password must be at least 6 characters";
    case "auth/email-already-in-use":
      return "That email is already registered";
    case "auth/user-not-found":
      return "User not found";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/missing-password":
      return "Incorrect email or password";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later";
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled";
    default:
      return `Something went wrong (${code || "unknown"}). Please try again`;
  }
}

function getCode(err: unknown) {
  return (err as { code?: string }).code ?? "";
}

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isOpen, view } = useAppSelector((state) => state.modal);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  function resetForm() {
    setEmail("");
    setPassword("");
    setError("");
    setMessage("");
  }

  function close() {
    resetForm();
    dispatch(closeModal());
  }

  function switchView(nextView: ModalView) {
    setError("");
    setMessage("");
    dispatch(setView(nextView));
  }

  async function runAuth(action: () => Promise<unknown>) {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await action();
      close();
      router.push("/for-you");
    } catch (err) {
      setError(getErrorMessage(getCode(err)));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (view === "reset") {
      setError("");
      setMessage("");
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset email sent. Check your inbox.");
      } catch (err) {
        setError(getErrorMessage(getCode(err)));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (view === "register" && password.length < 6) {
      setMessage("");
      setError("Password must be at least 6 characters");
      return;
    }

    if (view === "login") {
      await runAuth(() => signInWithEmailAndPassword(auth, email, password));
    } else {
      await runAuth(() =>
        createUserWithEmailAndPassword(auth, email, password),
      );
    }
  }

  return (
    <div className="auth__overlay" onClick={close}>
      <div className="auth__modal" onClick={(event) => event.stopPropagation()}>
        <button className="auth__close" onClick={close} aria-label="Close">
          <IoClose />
        </button>

        <div className="auth__title">{titles[view]}</div>

        {view !== "reset" && (
          <>
            <button
              className="auth__btn auth__btn--guest"
              disabled={loading}
              onClick={() =>
                runAuth(() =>
                  signInWithEmailAndPassword(auth, GUEST_EMAIL, GUEST_PASSWORD),
                )
              }
            >
              <FaUser />
              <span>Login as a Guest</span>
            </button>

            <div className="auth__separator">
              <span>or</span>
            </div>

            <button
              className="auth__btn auth__btn--google"
              disabled={loading}
              onClick={() =>
                runAuth(() => signInWithPopup(auth, new GoogleAuthProvider()))
              }
            >
              <FcGoogle />
              <span>
                {view === "login" ? "Login with Google" : "Sign up with Google"}
              </span>
            </button>

            <div className="auth__separator">
              <span>or</span>
            </div>
          </>
        )}

        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          <input
            className="auth__input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {view !== "reset" && (
            <input
              className="auth__input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          )}

          {error && <div className="auth__error">{error}</div>}
          {message && <div className="auth__message">{message}</div>}

          <button
            className="auth__btn auth__btn--submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : view === "login"
                ? "Login"
                : view === "register"
                  ? "Sign up"
                  : "Send reset password link"}
          </button>
        </form>

        <div className="auth__links">
          {view === "login" && (
            <>
              <button
                className="auth__link"
                onClick={() => switchView("reset")}
              >
                Forgot your password?
              </button>
              <button
                className="auth__link"
                onClick={() => switchView("register")}
              >
                Don&apos;t have an account?
              </button>
            </>
          )}
          {view === "register" && (
            <button className="auth__link" onClick={() => switchView("login")}>
              Already have an account?
            </button>
          )}
          {view === "reset" && (
            <button className="auth__link" onClick={() => switchView("login")}>
              Go to login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}