"use client";

import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/modalSlice";
import Skeleton from "@/components/Skeleton";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { uid, email, ready, plan } = useAppSelector((state) => state.user);

  if (!ready) {
    return (
      <div className="settings">
        <Skeleton width={160} height={32} />
        <div className="settings__block">
          <Skeleton width={180} height={18} />
          <Skeleton width={100} height={16} />
        </div>
        <div className="settings__block">
          <Skeleton width={80} height={18} />
          <Skeleton width={220} height={16} />
        </div>
      </div>
    );
  }

  if (!uid) {
    return (
      <div className="settings__login">
        <div className="settings__login-icon">
          <FaUserCircle />
        </div>
        <div className="settings__login-text">
          Log in to your account to see your settings
        </div>
        <button
          className="settings__btn"
          onClick={() => dispatch(openModal("login"))}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="settings">
      <div className="settings__title">Settings</div>

      <div className="settings__block">
        <div className="settings__label">Your Subscription plan</div>
        <div className="settings__value">{plan}</div>
        {plan === "basic" && (
          <Link href="/choose-plan" className="settings__btn">
            Upgrade to Premium
          </Link>
        )}
      </div>

      <div className="settings__block">
        <div className="settings__label">Email</div>
        <div className="settings__value">{email}</div>
      </div>
    </div>
  );
}