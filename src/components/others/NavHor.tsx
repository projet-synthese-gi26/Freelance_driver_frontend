"use client"
import Link from "next/link";
import React, { useState, useRef,useEffect } from "react";



interface MenuItem {
  url: any;
  title: string | JSX.Element;
  submenu?: MenuItem[];
  reference?: string;
  action?: () => void;
}

interface DropdownProps {
  subNavdata: MenuItem[];
  dropdown: boolean;
  depthLevel: number;
}

const Dropdown: React.FC<DropdownProps> = ({
                                             subNavdata,
                                             dropdown,
                                             depthLevel,
                                           }) => {
  depthLevel = depthLevel + 1;
  const dropdownClass =
      depthLevel > 1
          ? "static lg:absolute left-full z-10 bg-white min-w-[200px] top-0"
          : "top-full static lg:absolute min-w-[200px] left-0 z-10 bg-white";
  return (
      <ul
          className={`my-dropdown static duration-300 shadow-md ${dropdownClass} ${
              dropdown ? "flexStart flex-col border-b text-blue-900 border-orange-600 sm:min-w-[220px] min-w-max   rounded-xl ring-1  ring-gray-900/5 shadow-menu" : "hidden"
          }`}>
        {subNavdata.map((submenu, index) => (
            <MenuItems depthLevel={depthLevel} items={submenu} key={index} />
        ))}
      </ul>
  );
};

interface MenuItemsProps {
  items: MenuItem;
  depthLevel: number;
}

const MenuItems: React.FC<MenuItemsProps> = ({ items, depthLevel }) => {

  const [dark, setDark] = useState(false);
  const navbarDark = () => {
    if (window.scrollY > 10 && window.scrollY < window.innerHeight - 80) {
      setDark(false);
    } else if (window.scrollY >= window.innerHeight - 80) {
      setDark(true);
    } else {
      setDark(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", navbarDark);
    return () => {
      window.removeEventListener("scroll", navbarDark);
    };
  }, []);

  const [dropdown, setDropdown] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  const onMouseEnter = () => {
    window.innerWidth > 992 && setDropdown(true);
  };

  const onMouseLeave = () => {
    window.innerWidth > 992 && setDropdown(false);
  };

  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (
          dropdown &&
          ref.current &&
          !ref.current.contains(event.target as Node)
      ) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [dropdown]);

  return (
      <li className="group relative text menu-items cursor-pointer"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          ref={ref}>
        {items.submenu ? (
            <>

          <span
              aria-haspopup="menu"
              aria-expanded={dropdown ? "true" : "false"}
              onClick={() => setDropdown((prev) => !prev)}
              className="flex items-center text-[#243757] justify-between gap-1 font-bold">
            {items.title}{" "}
            {depthLevel > 0 && <i className="las la-angle-right"></i>}
            {depthLevel == 0 && typeof items.title === "string" && (
                <i className="las la-angle-down"></i>
            )}
          </span>
              <Dropdown
                  dropdown={dropdown}
                  subNavdata={items.submenu}
                  depthLevel={depthLevel}
              />
            </>
        ) : (

            //   <a
            //   href={`#${items.reference}`}
            //   className={`px-1 mx-8 py-4 xl:mx-4 hover:text-opacity-80 `}
            // >
            //   {items.title}
            // </a>
            items.action ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  items.action?.();
                  setDropdown(false);
                }}
                className="font-bold text-[#243757]"
              >
                {items.title}
              </button>
            ) : (
              <Link href={`${items.url}`} className="font-bold text-[#243757]">{items.title}</Link>
            )

        )}
      </li>
  );
};

/////////////////////////////////
type linkProps = {
  title?: string;
  reference: string;
  items:any;
  id?: any; // Use 'id' instead of 'key' if you need this value within the component

};

const NavHor = ({ title, reference,items, id}: linkProps) => {
  const depthLevel = 0;
  return <MenuItems items={items} key={id} depthLevel={depthLevel} />;
};


export default NavHor;