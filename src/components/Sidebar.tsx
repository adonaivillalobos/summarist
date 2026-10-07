"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { AiOutlineHome } from "react-icons/ai";
import {
  BiBookmark,
  BiHelpCircle,
  BiHighlight,
  BiLogIn,
  BiLogOut,
  BiSearch,
} from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { auth } from "@/firebase";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { openModal } from "@/redux/modalSlice";

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

export default function Sidebar({ open, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { uid, ready } = useAppSelector((state) => state.user);

  function linkClasses(href: string) {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return `sidebar__link ${active ? "sidebar__link--active" : ""}`;
  }

  async function handleAuthClick() {
    onNavigate();
    if (uid) {
      await signOut(auth);
      router.push("/");
    } else {
      dispatch(openModal("login"));
    }
  }

  return (
    <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
      <div className="sidebar__logo">
        <img src="/assets/logo.png" alt="logo" />
      </div>

      <div className="sidebar__wrapper">
        <div className="sidebar__top">
          <Link
            href="/for-you"
            className={linkClasses("/for-you")}
            onClick={onNavigate}
          >
            <span className="sidebar__icon">
              <AiOutlineHome />
            </span>
            <span>For you</span>
          </Link>
          <Link
            href="/library"
            className={linkClasses("/library")}
            onClick={onNavigate}
          >
            <span className="sidebar__icon">
              <BiBookmark />
            </span>
            <span>My Library</span>
          </Link>
          <div className="sidebar__link sidebar__link--disabled">
            <span className="sidebar__icon">
              <BiHighlight />
            </span>
            <span>Highlights</span>
          </div>
          <div className="sidebar__link sidebar__link--disabled">
            <span className="sidebar__icon">
              <BiSearch />
            </span>
            <span>Search</span>
          </div>
        </div>

        <div className="sidebar__bottom">
          <Link
            href="/settings"
            className={linkClasses("/settings")}
            onClick={onNavigate}
          >
            <span className="sidebar__icon">
              <IoSettingsOutline />
            </span>
            <span>Settings</span>
          </Link>
          <div className="sidebar__link sidebar__link--disabled">
            <span className="sidebar__icon">
              <BiHelpCircle />
            </span>
            <span>Help &amp; Support</span>
          </div>
          <button
            className="sidebar__link"
            onClick={handleAuthClick}
            disabled={!ready}
          >
            <span className="sidebar__icon">
              {uid ? <BiLogOut /> : <BiLogIn />}
            </span>
            <span>{ready ? (uid ? "Logout" : "Login") : ""}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}