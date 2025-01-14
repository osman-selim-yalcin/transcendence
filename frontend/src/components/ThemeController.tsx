// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { useDarkTheme } from "../hooks/ThemeHook.tsx";

export default function ThemeController() {
  return (
    <>
      <Dropdown />
    </>
  );
}

const Dropdown = () => {
  const [darkTheme, setDarkTheme] = useDarkTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(null);

  const domNode = useClickOutside(() => {
    setDropdownOpen(false);
  });

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        )
          setIsDark(document.documentElement.classList.contains("dark"));
      }
    };
    const config = {
      attributes: true,
      attributeFilter: ["class"],
    };
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, config);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={domNode} className="relative inline-block flex-initial text-left">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center rounded-md bg-slate-400 px-3 py-3 text-base font-medium`}
      >
        {isDark ? (
          // Moon Icon
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        ) : (
          // Sun Icon
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        )}
      </button>
      <div
        className={`shadow-1 absolute right-0 z-40 mt-2 w-36 rounded-md bg-white dark:bg-slate-900 py-[10px] transition-all ${
          dropdownOpen
            ? "visible top-full opacity-100"
            : "invisible top-[110%] opacity-0"
        }`}
      >
        <DropdownItem
          label="System"
          clickHandler={() => {
            setDarkTheme(null);
            setDropdownOpen(false);
          }}
          active={darkTheme === null}
        />
        <DropdownItem
          label="Dark"
          clickHandler={() => {
            setDarkTheme(true);
            setDropdownOpen(false);
          }}
          active={darkTheme === true}
        />
        <DropdownItem
          label="Light"
          clickHandler={() => {
            setDarkTheme(false);
            setDropdownOpen(false);
          }}
          active={darkTheme === false}
        />
      </div>
    </div>
  );
};

const useClickOutside = (handler) => {
  const domNode = useRef();

  useEffect(() => {
    const maybeHandler = (event) => {
      if (!domNode.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const DropdownItem = ({ label, clickHandler, active }) => {
  return (
    <div
      className={`block w-full cursor-pointer px-5 py-2 hover:bg-sky-600 hover:text-white ${active ? "font-bold text-sky-600" : ""}`}
      onClick={clickHandler}
    >
      {label}
    </div>
  );
};
