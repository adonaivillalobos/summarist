"use client";

import { useEffect, useState } from "react";

export default function ActiveHeadings({ headings }: { headings: string[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) {
      return;
    }
    const id = setInterval(() => {
      setActive((current) => (current + 1) % headings.length);
    }, 3000);
    return () => clearInterval(id);
  }, [paused, headings.length]);

  return (
    <>
      {headings.map((heading, index) => (
        <div
          key={heading}
          className={`statistics__heading ${
            index === active ? "statistics__heading--active" : ""
          }`}
          onClick={() => setActive(index)}
          onMouseEnter={() => {
            setActive(index);
            setPaused(true);
          }}
          onMouseLeave={() => setPaused(false)}
        >
          {heading}
        </div>
      ))}
    </>
  );
}