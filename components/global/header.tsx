"use client";
import Link from "next/link";
import Portal from "./portal";
import { useState } from "react";
import SideMenu from "./side-menu";
import NavLink from "../ui/nav-link";
import { useHash } from "@/hooks/useHash";
import MenuToggle from "../ui/menu-toggle";
import SoundToggle from "../ui/sound-toggle";

const Header: React.FC = () => {
  const hash = useHash();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full px-12 max-md:px-8 h-16 flex items-center justify-between z-20 text-primary">
      <Link href="/" className="w-[100px]">
        Home
      </Link>

      <nav className="md:flex hidden gap-8">
        <NavLink href="#about" path={hash}>
          About
        </NavLink>
        <NavLink href="#ereosa" path={hash}>
          Ereosa
        </NavLink>
        <NavLink path={hash} href="#characters">
          Roles
        </NavLink>
        <NavLink href="#quiz" path={hash}>
          Quiz
        </NavLink>
      </nav>
      <div className="md:w-[100px] w-fit flex items-center md:justify-end justify-center gap-1">
        <SoundToggle />
        <MenuToggle open={isOpen} handleClick={() => setIsOpen(!isOpen)} />
      </div>
      <Portal>
        {isOpen && (
          <SideMenu open={isOpen} handleClick={() => setIsOpen(false)} />
        )}
      </Portal>
    </header>
  );
};

export default Header;

{
  /* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="88"
          height="89"
          viewBox="0 0 88 89"
          fill="none"
          className="btn__grow"
        >
          <g filter="url(#filter0_f_6587_3779)">
            <path
              fill="none"
              d="M79.2772 39.8839C85.1004 61.603 71.2873 75.883 45.8134 82.7045C26.5499 87.8629 13.5523 68.9115 8.57604 50.3515C3.11311 26.843 21.1028 12.7143 40.3664 7.55583C59.6299 2.3974 72.3952 14.2159 79.2772 39.8839Z"
              stroke="#9D6E46"
              className="btn__rotate-reverse"
            ></path>
          </g>
          <path
            fill="none"
            className="btn__rotate-reverse"
            d="M79.6823 40.689C85.4941 62.6302 71.6766 77.0648 46.2038 83.9693C26.9412 89.1905 13.955 70.0491 8.98853 51.2993C3.53783 27.5499 21.5312 13.2661 40.7938 8.04493C60.0564 2.82373 72.8138 14.7584 79.6823 40.689Z"
            stroke="#9D6E46"
          ></path>
          <path
            fill="none"
            opacity="0.4"
            className="btn__rotate"
            d="M62.4666 15.6093C84.6472 25.7798 87.7796 45.5223 77.024 68.9216C68.8907 86.6163 44.3981 83.6003 25.4438 74.9092C1.98109 63.2791 1.68789 40.5466 9.82126 22.8519C17.9546 5.1572 36.2532 3.58968 62.4666 15.6093Z"
            stroke="#9D6E46"
          ></path>
          <defs>
            <filter
              id="filter0_f_6587_3779"
              x="3.08325"
              y="1.86932"
              width="82.0162"
              height="86.196"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                stdDeviation="2"
                result="effect1_foregroundBlur_6587_3779"
              ></feGaussianBlur>
            </filter>
          </defs>
        </svg> */
}
//  <svg
// xmlns="http://www.w3.org/2000/svg"
// width="88"
// height="89"
// viewBox="0 0 88 89"
// fill="none"
// className="btn__grow"
// >
// <g filter="url(#filter0_f_6587_3779)">
//   <path
//     fill="none"
//     d="M79.2772 39.8839C85.1004 61.603 71.2873 75.883 45.8134 82.7045C26.5499 87.8629 13.5523 68.9115 8.57604 50.3515C3.11311 26.843 21.1028 12.7143 40.3664 7.55583C59.6299 2.3974 72.3952 14.2159 79.2772 39.8839Z"
//     stroke="#9D6E46"
//     className="btn__rotate-reverse"
//   ></path>
// </g>
// <path
//   fill="none"
//   className="btn__rotate-reverse"
//   d="M79.6823 40.689C85.4941 62.6302 71.6766 77.0648 46.2038 83.9693C26.9412 89.1905 13.955 70.0491 8.98853 51.2993C3.53783 27.5499 21.5312 13.2661 40.7938 8.04493C60.0564 2.82373 72.8138 14.7584 79.6823 40.689Z"
//   stroke="#9D6E46"
// ></path>
// <path
//   fill="none"
//   opacity="0.4"
//   className="btn__rotate"
//   d="M62.4666 15.6093C84.6472 25.7798 87.7796 45.5223 77.024 68.9216C68.8907 86.6163 44.3981 83.6003 25.4438 74.9092C1.98109 63.2791 1.68789 40.5466 9.82126 22.8519C17.9546 5.1572 36.2532 3.58968 62.4666 15.6093Z"
//   stroke="#9D6E46"
// ></path>
// <defs>
//   <filter
//     id="filter0_f_6587_3779"
//     x="3.08325"
//     y="1.86932"
//     width="82.0162"
//     height="86.196"
//     filterUnits="userSpaceOnUse"
//     color-interpolation-filters="sRGB"
//   >
//     <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
//     <feBlend
//       mode="normal"
//       in="SourceGraphic"
//       in2="BackgroundImageFix"
//       result="shape"
//     ></feBlend>
//     <feGaussianBlur
//       stdDeviation="2"
//       result="effect1_foregroundBlur_6587_3779"
//     ></feGaussianBlur>
//   </filter>
// </defs>
// </svg>
